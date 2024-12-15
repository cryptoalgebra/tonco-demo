import { Address, beginCell, Cell,  Dictionary, DictionaryValue, Contract, contractAddress,  ContractProvider, Sender, SendMode } from "@ton/core";
import { ContractOpcodes, OpcodesLookup } from "./opCodes";
import { BLACK_HOLE_ADDRESS } from "./tonUtils";
import { FEE_DENOMINATOR, IMPOSSIBLE_FEE } from "./frontmath/frontMath";

  

/** Inital data structures and settings **/
export type PoolV3ContractConfig = {    
    router_address : Address;
    admin_address? : Address;

    lp_fee_base?  : number;
    protocol_fee? : number;

    jetton0_wallet : Address;
    jetton1_wallet : Address;

    tick_spacing?   : number;
    
    pool_active?    : boolean;
    tick?           : number;
    price_sqrt?     : bigint;
    liquidity?      : bigint;
    lp_fee_current? : number;

    accountv3_code : Cell;
    position_nftv3_code : Cell;   

    nftContent? : Cell;
    nftItemContent? : Cell;
};

export class TickInfoWrapper { 
    constructor(
        public liquidityGross : bigint = 0n,
        public liquidityNet : bigint = 0n,
        public outerFeeGrowth0Token : bigint = 0n,
        public outerFeeGrowth1Token : bigint = 0n
    )
    {}
};

const DictionaryTickInfo: DictionaryValue<TickInfoWrapper> = {
    serialize(src, builder) {
        builder.storeUint(src.liquidityGross, 256);
        builder.storeInt (src.liquidityNet, 128);
        builder.storeUint(src.outerFeeGrowth0Token, 256);
        builder.storeUint(src.outerFeeGrowth1Token, 256);        
    },
    parse(src) {
      let tickInfo = new TickInfoWrapper();
      tickInfo.liquidityGross = src.loadUintBig(256);
      tickInfo.liquidityNet   = src.loadIntBig(128);
      tickInfo.outerFeeGrowth0Token = src.loadUintBig(256);
      tickInfo.outerFeeGrowth1Token = src.loadUintBig(256);      
      return tickInfo;
    }
}


export function embedJettonData (content :Cell, jetton0Name : string, decimals0: number,  jetton1Name : string, decimals1: number): Cell {
    let p = content.beginParse()

    //console.log("embedJettonData l0 ", Buffer.from(jetton0Name).length )
    //console.log("embedJettonData l1 ", Buffer.from(jetton1Name).length )

    const result : Cell = beginCell()
        .storeInt (p.loadUint(8), 8)
        .storeMaybeRef (p.loadRef())
        .storeUint(decimals0,6)
        .storeUint(Buffer.from(jetton0Name).length, 8)
        .storeBuffer(Buffer.from(jetton0Name))
        .storeUint(decimals1,6)
        .storeUint(Buffer.from(jetton1Name).length, 8)
        .storeBuffer(Buffer.from(jetton1Name))
    .endCell();
    return result;
}


/* This function creates the config only form the values that affect the address */
export function poolv3StateInitConfig(
    jetton0Wallet: Address,
    jetton1Wallet: Address,
    accountV3Code: Cell,
    positionNftV3Code: Cell,
    routerAddress: Address
) : PoolV3ContractConfig {
    let order = PoolV3Contract.orderJettonId(jetton0Wallet, jetton1Wallet)

    const config: PoolV3ContractConfig = {
        router_address : routerAddress,
  
        jetton0_wallet : order ? jetton0Wallet : jetton1Wallet,
        jetton1_wallet : order ? jetton1Wallet : jetton0Wallet,
  
        accountv3_code : accountV3Code,
        position_nftv3_code : positionNftV3Code
    }
    return config
}


export function poolv3ContractConfigToCell(config: PoolV3ContractConfig): Cell {
    let ticks = Dictionary.empty(Dictionary.Keys.Int(24), DictionaryTickInfo);
  
  
    return beginCell()
        .storeAddress(config.router_address)
        .storeUint   (config.lp_fee_base    ?? 30, 16)
        .storeUint   (config.protocol_fee   ?? 30, 16)
        .storeUint   (config.lp_fee_current ?? 30, 16)
        .storeAddress(config.jetton0_wallet)
        .storeAddress(config.jetton1_wallet)
        .storeUint   (config.tick_spacing ??  1, 24)
        .storeUint   (0, 64)   // poolv3::seqno

        .storeRef( beginCell()
            .storeUint(0n, 256) // poolv3::feeGrowthGlobal0X128  
            .storeUint(0n, 256) // poolv3::feeGrowthGlobal1X128  
            .storeUint(0n, 128) // poolv3::collectedProtocolFee0
            .storeUint(0n, 128) // poolv3::collectedProtocolFee1  

            .storeCoins(0n) // poolv3::reserve0
            .storeCoins(0n) // poolv3::reserve1
        .endCell())
        .storeRef( beginCell()
            .storeUint( 0 ,   1) 
            .storeInt (config.tick           ??  0,  24) 
            .storeUint(config.price_sqrt     ??  0, 160)
            .storeUint(config.liquidity      ??  0, 128) 
            .storeUint (0, 24)  // Occupied ticks

            .storeUint (0, 64)  // NFT Inital counter
            .storeUint (0, 64)  // NFT Active counter

            .storeAddress(config.admin_address ?? BLACK_HOLE_ADDRESS) 
            .storeAddress(BLACK_HOLE_ADDRESS) // poolv3::controller_address
            .storeRef( beginCell()
                .storeAddress(BLACK_HOLE_ADDRESS) // poolv3::jetton0_minter
                .storeAddress(BLACK_HOLE_ADDRESS) // poolv3::jetton1_minter
            .endCell())
          
        .endCell())      
        .storeRef( beginCell()
            .storeDict(ticks)         
        .endCell())
        .storeRef( beginCell()
            .storeRef(config.accountv3_code)
            .storeRef(config.position_nftv3_code)
            .storeRef(config.nftContent     ?? new Cell)
            .storeRef(config.nftItemContent ?? new Cell)
        .endCell())              
    .endCell();
}


export type NumberedTickInfo = { 
    tickNum : number,
    liquidityGross : bigint,
    liquidityNet   : bigint,
    outerFeeGrowth0Token? : bigint,
    outerFeeGrowth1Token? : bigint 
}
  
  /** Pool  **/
export class PoolV3Contract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}


    static orderJettonId(jetton0Wallet: Address, jetton1Wallet : Address ) : boolean
    {
        // let result1 =  beginCell().storeAddress(jetton0Wallet).endCell().hash() > beginCell().storeAddress(jetton1Wallet).endCell().hash()
        
        let strHex0 = beginCell().storeAddress(jetton0Wallet).endCell().hash().toString("hex");
        let strHex1 = beginCell().storeAddress(jetton1Wallet).endCell().hash().toString("hex");

        let result2 = BigInt("0x" + strHex0) > BigInt("0x" + strHex1)

        //if (result1 != result2) throw Error("Unexpected")

        return result2
    }

 
    static createFromConfig(
        config: PoolV3ContractConfig,
        code: Cell,
        workchain = 0
    ) {
        const data = poolv3ContractConfigToCell(config);     
        const init = { code, data };
        const address = contractAddress(workchain, init);
    
        return new PoolV3Contract(address, init);
    }
  
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint,         
        tickSpacing : number,
        sqrtPriceX96: bigint,        
        opts: {
            is_from_admin? : boolean
            activate_pool? : boolean, 

            jetton0Minter?: Address,
            jetton1Minter?: Address,
            admin? : Address,
            controller?: Address,

            nftContentPacked? : Cell,
            nftItemContentPacked? : Cell,

            protocolFee? : number,
            lpFee      ? : number,
            currentFee ? : number
        }    
    ) {
        if (! opts.activate_pool) {
            opts.activate_pool = false
        }

        let minterCell = null
        if (opts.jetton0Minter && opts.jetton0Minter) {
            minterCell = beginCell()
                .storeAddress(opts.jetton0Minter)
                .storeAddress(opts.jetton1Minter)
           .endCell()
        }

        if (opts.is_from_admin == undefined) {
            opts.is_from_admin = true
        }
        
        let body : Cell = beginCell()
            .storeUint(ContractOpcodes.POOLV3_INIT, 32) // OP code
            .storeUint(0, 64) // query_id
            .storeUint((opts.is_from_admin ? 1 : 0) , 1)  // is from admin. 
            .storeUint(opts.admin ? 1 : 0, 1)
            .storeAddress(opts.admin)                 // null is an invalid Address, but valid slice
            .storeUint(opts.controller ? 1 : 0, 1)
            .storeAddress(opts.controller)

            .storeUint(1, 1)            
            .storeUint(tickSpacing , 24)
            .storeUint(1, 1)            
            .storeUint(sqrtPriceX96, 160)
            .storeUint(1, 1)
            .storeUint(opts.activate_pool ? 1 : 0, 1)

            .storeUint(opts.protocolFee ? opts.protocolFee  : IMPOSSIBLE_FEE , 16)
            .storeUint(opts.lpFee       ? opts.lpFee        : IMPOSSIBLE_FEE , 16)
            .storeUint(opts.currentFee  ? opts.currentFee   : IMPOSSIBLE_FEE , 16)  

            .storeRef(opts.nftContentPacked     ?? Cell.EMPTY)
            .storeRef(opts.nftItemContentPacked ?? Cell.EMPTY)
            .storeMaybeRef(minterCell)
        .endCell();
    
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body,
        });
    }


    static reinitMessage(
        opts: {
            is_from_admin? : boolean

            activate_pool? : boolean, 
            tickSpacing?   : number,
            sqrtPriceX96?  : bigint,
    

            jetton0Minter? : Address,
            jetton1Minter? : Address,
            admin? : Address,
            controller?: Address,

            nftContentPacked? : Cell,
            nftItemContentPacked? : Cell,

            protocolFee?: number,
            lpFee      ?: number,
            currentFee ?: number
        }
    ) : Cell
    {
        if (opts.is_from_admin == undefined) {
            opts.is_from_admin = true
        }

        let minterCell = null;
        if (opts.jetton0Minter && opts.jetton0Minter) {
            minterCell = beginCell()
                .storeAddress(opts.jetton0Minter)
                .storeAddress(opts.jetton1Minter)
           .endCell()
        }        
        let body : Cell = beginCell()
            .storeUint(ContractOpcodes.POOLV3_INIT, 32) // OP code
            .storeUint(0, 64) // query_id
            .storeUint(opts.is_from_admin ? 1 : 0, 1) // is_from_admin
            
            .storeUint(opts.admin == undefined ? 0 : 1, 1)
            .storeAddress(opts.admin)                 // null is an invalid Address, but valid slice
            .storeUint(opts.controller == undefined ? 0 : 1, 1)
            .storeAddress(opts.controller)

            .storeUint(opts.tickSpacing == undefined ? 0 : 1, 1)
            .storeUint(opts.tickSpacing ?? 0, 24)
            .storeUint(opts.sqrtPriceX96 == undefined ? 0 : 1, 1)            
            .storeUint(opts.sqrtPriceX96 ?? 0, 160)
            .storeUint(opts.activate_pool == undefined ? 0 : 1, 1)
            .storeUint(opts.activate_pool ? 1 : 0, 1)

            .storeUint(opts.protocolFee ? opts.protocolFee  : IMPOSSIBLE_FEE , 16)
            .storeUint(opts.lpFee       ? opts.lpFee        : IMPOSSIBLE_FEE , 16)
            .storeUint(opts.currentFee  ? opts.currentFee   : IMPOSSIBLE_FEE , 16)  

            .storeRef(opts.nftContentPacked     ?? beginCell().endCell())
            .storeRef(opts.nftItemContentPacked ?? beginCell().endCell())
            .storeMaybeRef(minterCell)
        .endCell();

        return body
    }

    static unpackReinitMessage( body :Cell) : {
        is_from_admin? : boolean, 
        activate_pool? : boolean, 
        tickSpacing?   : number,
        sqrtPriceX96?  : bigint,

        jetton0Minter? : Address,
        jetton1Minter? : Address,
        admin? : Address,
        controller?: Address,

        nftContentPacked? : Cell,
        nftItemContentPacked? : Cell

        protocolFee?: number,
        lpFee      ?: number,
        currentFee ?: number
    }
    {
        let s = body.beginParse()
        const op       = s.loadUint(32)
        if (op != ContractOpcodes.POOLV3_INIT)
            throw Error("Wrong opcode")
        const query_id = s.loadUint(64)
        const is_from_admin = (s.loadUint(1) != 0)
        const setAdmin = s.loadUint(1)
        const admin = (setAdmin == 1) ? s.loadAddress() : undefined
        if (setAdmin == 0) { s.loadUint(2) }

        const setControl = s.loadUint(1)
        const controller = (setControl == 1) ? s.loadAddress() : undefined
        if (setControl == 0) { s.loadUint(2) }

        const setTickSpacing = s.loadUint(1)
        let tickSpacingV = s.loadUint(24) 
        let tickSpacing = (setTickSpacing != 0) ? tickSpacingV : undefined

        const setPrice = s.loadUint(1)
        let sqrtPriceX96V = s.loadUintBig(160) 
        let sqrtPriceX96 = (setPrice != 0) ? sqrtPriceX96V : undefined

        const setActive = s.loadUint(1)
        let activate_poolV = (s.loadUint(1) == 1)
        let activate_pool = (setActive != 0) ? activate_poolV : undefined

        const protocolFeeV = s.loadUint(16)        
        const protocolFee = (protocolFeeV < IMPOSSIBLE_FEE) ? protocolFeeV : undefined        
        const lpFeeV       = s.loadUint(16)
        const lpFee = (lpFeeV < IMPOSSIBLE_FEE) ? lpFeeV : undefined        
        const currentFeeV  = s.loadUint(16)
        const currentFee = (currentFeeV < IMPOSSIBLE_FEE) ? currentFeeV : undefined        



        let nftContentPackedV = s.loadRef()
        let nftContentPacked  =  (nftContentPackedV.beginParse().remainingBits != 0) ? nftContentPackedV : undefined

        let nftItemContentPackedV = s.loadRef()
        let nftItemContentPacked  =  (nftItemContentPackedV.beginParse().remainingBits != 0) ? nftItemContentPackedV : undefined

        return {is_from_admin, admin, controller, tickSpacing, sqrtPriceX96, activate_pool, nftContentPacked, nftItemContentPacked, protocolFee, lpFee, currentFee}

    }


    async sendReinit(provider: ContractProvider, via: Sender, value: bigint,           
        opts: {
            is_from_admin? : boolean, 

            activate_pool? : boolean, 
            tickSpacing?   : number,
            sqrtPriceX96?  : bigint,

            jetton0Minter? : Address,
            jetton1Minter? : Address,
            admin? : Address,
            controller?: Address,

            nftContentPacked? : Cell,
            nftItemContentPacked? : Cell,

            protocolFee?: number,
            lpFee      ?: number,
            currentFee ?: number
        }
    
    ) {
        await provider.internal(via, { 
            value, 
            sendMode: SendMode.PAY_GAS_SEPARATELY, 
            body: PoolV3Contract.reinitMessage(opts)
         })
    }

    static messageSetFees(
        protocolFee: number,
        lpFee      : number,
        currentFee : number
    ) {
        return beginCell()
            .storeUint(ContractOpcodes.POOLV3_SET_FEE, 32) // OP code
            .storeUint(0, 64) // query_id  
            .storeUint(protocolFee, 16)
            .storeUint(lpFee      , 16)        
            .storeUint(currentFee , 16)                
        .endCell()
    }

    static unpackSetFeesMessage( body :Cell ) : {
        protocolFee: number,
        lpFee      : number,
        currentFee : number
    } {
        let s = body.beginParse()
        const op       = s.loadUint(32)
        if (op != ContractOpcodes.POOLV3_SET_FEE)
            throw Error("Wrong opcode")

        const query_id = s.loadUint(64)
        const protocolFee = s.loadUint(16)
        const lpFee = s.loadUint(16)
        const currentFee = s.loadUint(16)
        return {protocolFee, lpFee, currentFee}
    }

    async sendSetFees(
        provider: ContractProvider, 
        sender: Sender, 
        value: bigint, 

        protocolFee: number,
        lpFee      : number,
        currentFee : number
    ) {
        const msg_body = PoolV3Contract.messageSetFees(protocolFee, lpFee, currentFee)
        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: msg_body })
    }

    /* ==== LOCK ==== */
    static messageLockPool() : Cell {
        return beginCell()
            .storeUint(ContractOpcodes.POOLV3_LOCK, 32) // OP code
            .storeUint(0, 64) // query_id          
        .endCell()
    }

    static unpackLockPoolMessage(body : Cell) {
        let s = body.beginParse()
        const op       = s.loadUint(32)
        if (op != ContractOpcodes.POOLV3_LOCK)
            throw Error("Wrong opcode")

        const query_id = s.loadUint(64)
    }

    async sendLockPool(provider: ContractProvider, sender: Sender, value: bigint) 
    {
        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: PoolV3Contract.messageLockPool() })
    }

    /* ==== UNLOCK ==== */
    static messageUnlockPool() : Cell {
        return beginCell()
            .storeUint(ContractOpcodes.POOLV3_UNLOCK, 32) // OP code
            .storeUint(0, 64) // query_id          
        .endCell()
    }

    static unpackUnlockPoolMessage(body : Cell) {
        let s = body.beginParse()
        const op       = s.loadUint(32)
        if (op != ContractOpcodes.POOLV3_UNLOCK)
            throw Error("Wrong opcode")

        const query_id = s.loadUint(64)
    }

    async sendUnlockPool(provider: ContractProvider, sender: Sender, value: bigint) 
    {
        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: PoolV3Contract.messageUnlockPool() })
    }

    /* ==== PROTOCOL COLLECT ==== */
    static messageCollectProtocol() : Cell {
        return beginCell()
            .storeUint(ContractOpcodes.POOLV3_COLLECT_PROTOCOL, 32) // OP code
            .storeUint(0, 64) // query_id          
        .endCell()
    }

    static unpackCollectProtocolMessage(body : Cell) {
        let s = body.beginParse()
        const op       = s.loadUint(32)
        if (op != ContractOpcodes.POOLV3_COLLECT_PROTOCOL)
            throw Error("Wrong opcode")

        const query_id = s.loadUint(64)
    }

    async sendCollectProtocol(
        provider: ContractProvider, 
        sender: Sender, 
        value: bigint, 
    ) {
        
        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: PoolV3Contract.messageCollectProtocol() })
    }
     

    async sendBurn(
        provider: ContractProvider, 
        via: Sender, 
        value: bigint,
        nftIndex : bigint,
        tickLower : number,
        tickUpper : number,
        liquidity2Burn : bigint
    ) {
        await provider.internal(via, {
            value: value,
            body: beginCell()
                .storeUint(ContractOpcodes.POOLV3_START_BURN, 32) // op
                .storeUint(0, 64)                                 // query id
                .storeUint(nftIndex, 64)
                .storeUint(liquidity2Burn, 128)
                .storeInt(tickLower, 24)
                .storeInt(tickUpper, 24)                  
            .endCell()
        })
    }

    /** Swap (only can be accepted from router) **/
    static messageSwapPool(
        owner : Address,
        sourceWallet : Address,

        amount : bigint,
        sqrtPriceLimitX96 : bigint,
        minOutAmount : bigint,

        target_address? : Address
    ) : Cell {
        return beginCell()
            .storeUint(ContractOpcodes.POOLV3_SWAP, 32) // op
            .storeUint(0, 64)                           // query id

            .storeAddress(owner)
            .storeAddress(sourceWallet)
            .storeRef(beginCell()
                .storeCoins(amount)
                .storeUint(sqrtPriceLimitX96, 160)
                .storeCoins(minOutAmount)
            .endCell())
            
            .storeRef(beginCell()
                .storeAddress(target_address ?? null)
                .storeCoins(0)
                .storeMaybeRef(null)
                .storeCoins(0)                
                .storeMaybeRef(null)
            .endCell())            
        .endCell()
    }
   
    /** Getters **/
   
    async getIsActive(provider: ContractProvider) {
        const { stack } = await provider.get("getIsActive", []);
        return stack.readBoolean();
    }

    /* If not debug, it can actually would throw the exception */
    async getIsDebug(provider: ContractProvider) {
        try {
            const { stack } = await provider.get("isDebugBuild", [])
            return stack.readBoolean()
        } catch (err) {
            return false
        }
    }

    async getPoolStateAndConfiguration(provider: ContractProvider) {
        const { stack } = await provider.get("getPoolStateAndConfiguration", []);
   
        return {
            router_address     : stack.readAddress(),
            admin_address      : stack.readAddress(),
            controller_address : stack.readAddress(),

            jetton0_wallet : stack.readAddress(),
            jetton1_wallet : stack.readAddress(),

            jetton0_minter : stack.readAddress(),
            jetton1_minter : stack.readAddress(),

            pool_active    : stack.readBoolean(),   
            tick_spacing   : stack.readNumber(),   

            lp_fee_base    : stack.readNumber(),   
            protocol_fee   : stack.readNumber(),   
            lp_fee_current : stack.readNumber(),

            tick           : stack.readNumber(),   
            price_sqrt     : stack.readBigNumber(),   
            liquidity      : stack.readBigNumber(), 

            feeGrowthGlobal0X128  : stack.readBigNumber(), 
            feeGrowthGlobal1X128  : stack.readBigNumber(), 
            collectedProtocolFee0 : stack.readBigNumber(), 
            collectedProtocolFee1 : stack.readBigNumber(), 

            nftv3item_counter : stack.readBigNumber(),
            
            reserve0 : stack.readBigNumber(),
            reserve1 : stack.readBigNumber(),

            nftv3items_active : stack.readBigNumber(),
            ticks_occupied    :  stack.readNumber(),

            seqno    :  stack.readBigNumber(),
        }        
    }

    /* Tick related getters */
    /** 
     *  Returns a tick by tickNumber. If tick not inited - tick filled with zero will be returned.
     *  Also pervious tick and next tick numbers are returned
     *     
     *     
     *  @param provider   blockchain access provider
     *  @param tickNumber Tick to extract data for
     *  
     **/
    
    async getTickInfo(provider: ContractProvider, tickNumber : number) {

        const result = await this.getTickInfosFromArr(provider, tickNumber - 1, 1, false, true)
        if (result.length == 0 || result[0].tickNum != tickNumber)
            return new TickInfoWrapper()

        let tickInfo = new TickInfoWrapper();
        tickInfo.liquidityGross       = result[0].liquidityGross;
        tickInfo.liquidityNet         = result[0].liquidityNet;
        tickInfo.outerFeeGrowth0Token = result[0].outerFeeGrowth0Token ?? 0n;
        tickInfo.outerFeeGrowth1Token = result[0].outerFeeGrowth1Token ?? 0n;  
        return tickInfo
    }
    

    async getTickInfosAll(provider: ContractProvider) : Promise<NumberedTickInfo[]> {
        const { stack } = await provider.get("getAllTickInfos", 
        []);
          
        if (stack.peek().type !== 'cell' ) { return [] }
        let valueReader = stack.readCell();

        const dict = Dictionary.loadDirect(Dictionary.Keys.Int(24), DictionaryTickInfo, valueReader)

        let result : NumberedTickInfo[] = [];

        let tickKeys = dict.keys()
        tickKeys.sort((a, b) => (a - b))
        for (let key of tickKeys) 
        {
            const info = dict.get(key)
            result.push({
                tickNum: key, 
                liquidityGross       :info!.liquidityGross, 
                liquidityNet         :info!.liquidityNet, 
                outerFeeGrowth0Token :info!.outerFeeGrowth0Token, 
                outerFeeGrowth1Token :info!.outerFeeGrowth1Token           
            });
        }
        return result;
    }

     /** 
     *  Returns a hash object of ticks infos with all internal data starting from key >=tickNumber  or key <= tickNumber
     *  and no more then number. Unfortunately there is an internal limit of 255 tickInfos
     * 
     *     
     *  @param provider   blockchain access provider
     *  @param tickNumber Starting tick. Ticks greater or equal will be returned with back == false, with back == true - less or equal keys will be enumerated  
     *  @param amount     Number of tick infos to be returned
     *  @param back       directions of ticks
     *  @param full       should fee related fields be filled
     * 
     *  
     **/
    async getTickInfosFromArr(provider: ContractProvider, tickNumber: number, amount: number, back : boolean = false, full : boolean = false) {
        const { stack } = await provider.get("getTickInfosFrom", 
        [
            {type: 'int', value: BigInt(tickNumber)},
            {type: 'int', value: BigInt(amount)},
            {type: 'int', value: BigInt(back ? 1 : 0)},
            {type: 'int', value: BigInt(full ? 1 : 0)},            
        ]);
          
        if (stack.peek().type !== 'tuple' ) { return [] }
        let valueReader = stack.readTuple();

        let result : NumberedTickInfo[] = [];

        while (valueReader.remaining) 
        {
            // console.log("Outer iteration")
            let internalReader = valueReader.readTuple();
            while (internalReader.remaining) 
            {
               // console.log("Inner iteration")
                const infoTuple = internalReader.readTuple();
                const tickInfo : NumberedTickInfo = 
                {
                    tickNum: infoTuple.readNumber(), 
                    liquidityGross :infoTuple.readBigNumber(), 
                    liquidityNet   :infoTuple.readBigNumber(),
                    outerFeeGrowth0Token : full ? infoTuple.readBigNumber() : 0n,
                    outerFeeGrowth1Token : full ? infoTuple.readBigNumber() : 0n,
                }
                result.push(tickInfo);
                
            }
        }
        return result;
    }



    async getMintEstimate(provider: ContractProvider, tickLower: number, tickUpper: number, liquidity: bigint )
    {
        const { stack } = await provider.get("getMintEstimate", 
        [
            {type: 'int', value: BigInt(tickLower)},
            {type: 'int', value: BigInt(tickUpper)},
            {type: 'int', value: BigInt(liquidity)}
        ]);
        return { amount0 : stack.readBigNumber(), amount1: stack.readBigNumber(), mintErrors : stack.readNumber() };
    }

    async getSwapEstimate(provider: ContractProvider, zeroForOne: boolean, amount: bigint, sqrtPriceLimitX96: bigint, minOutAmount : bigint = 0n, gasLimit : bigint = 0n )
    {
        const { stack } = await provider.get("getSwapEstimateGas", 
        [
            {type: 'int', value: BigInt(zeroForOne ? 1 : 0)},
            {type: 'int', value: BigInt(amount)},
            {type: 'int', value: BigInt(sqrtPriceLimitX96)},
            {type: 'int', value: BigInt(minOutAmount)},
            {type: 'int', value: BigInt(gasLimit)}
        ]);
        return { amount0 : stack.readBigNumber(), amount1: stack.readBigNumber() };
    }


    async getCollectedFees(provider: ContractProvider, tickLower:number, tickUpper: number, posLiquidityDelta :bigint, posFeeGrowthInside0X128:bigint, posFeeGrowthInside1X128 :bigint )
    {
        const { stack } = await provider.get("getCollectedFees", 
        [
            {type: 'int', value: BigInt(tickLower)},
            {type: 'int', value: BigInt(tickUpper)},
            {type: 'int', value: BigInt(posLiquidityDelta)},
            {type: 'int', value: BigInt(posFeeGrowthInside0X128)},
            {type: 'int', value: BigInt(posFeeGrowthInside1X128)}
        ]);
        return { amount0 : stack.readBigNumber(), amount1: stack.readBigNumber() };
    }

    
    async getFeeGrowthInside(provider: ContractProvider, 
        tickLower : number,
        tickUpper : number,
        tickCurrent : number,
        feeGrowthGlobal0X128 : bigint,
        feeGrowthGlobal1X128 : bigint,
    ) {
        const { stack } = await provider.get("getFeeGrowthInside", 
        [
            {type: 'int', value: BigInt(tickLower)},
            {type: 'int', value: BigInt(tickUpper)},
            {type: 'int', value: BigInt(tickCurrent)},
            {type: 'int', value: BigInt(feeGrowthGlobal0X128)},
            {type: 'int', value: BigInt(feeGrowthGlobal1X128)},  
        ])
        return {
            feeGrowthInside0X128 : stack.readBigNumber(),
            feeGrowthInside1X128 : stack.readBigNumber()
        }
    }


    /* Subcontracts getters */
    async getUserAccountAddress(provider: ContractProvider, owner: Address): Promise<Address> {
        const res = await provider.get('getUserAccountAddress', 
        [
            { type: 'slice', cell: beginCell().storeAddress(owner).endCell() }
        ])
        return res.stack.readAddress()
    }

    async getNFTAddressByIndex(provider: ContractProvider,  index: bigint ): Promise<Address>
    {
        const res = await provider.get('get_nft_address_by_index', 
        [       
            { type: 'int', value: BigInt(index)},
        ])
        return res.stack.readAddress()
    }

    async getNFTCollectionContent(provider: ContractProvider)
    {
        const res = await provider.get('get_collection_data', [])
        return { 
            nftv3item_counter: res.stack.readBigNumber(), 
            nftv3_content    : res.stack.readCell(), 
            router_address   : res.stack.readAddress() 
        }
    }
  
    async getNFTContent(provider: ContractProvider,  index: bigint, nftItemContent : Cell): Promise<Cell>
    {
        const res = await provider.get('get_nft_content', 
        [       
            { type: 'int' , value: BigInt(index) },
            { type: 'cell', cell: nftItemContent},
            
        ])
        return res.stack.readCell()
    }

    

    /* Access code of subcontracts */
    async getChildContracts(provider: ContractProvider)  {
        const { stack } = await provider.get("getChildContracts", []);
        return {
            accountCode     : stack.readCell(),
            positionNFTCode : stack.readCell(),
            nftCollectionContent : stack.readCell(),
            nftItemContent  : stack.readCell(),            
        };
    }
  
}
