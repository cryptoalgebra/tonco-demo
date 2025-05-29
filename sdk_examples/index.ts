import { createMintMessage } from "./mint/message/createMintMessage";
import { estimateSwapExactIn } from "./swap/estimate/estimateSwapExactIn";
import { estimateSwapExactInMultihop } from "./swap/estimate/estimateSwapExactInMultihop";
import { estimateSwapExactOut } from "./swap/estimate/estimateSwapExactOut";
import { estimateSwapExactOutMultihop } from "./swap/estimate/estimateSwapExactOutMultihop";
import { createSwapMessage } from "./swap/message/createSwapMessage";
import { createSwapMultihopMessage } from "./swap/message/createSwapMultihopMessage";

estimateSwapExactIn();
// estimateSwapExactOut();
// estimateSwapExactInMultihop();
// estimateSwapExactOutMultihop();

// createSwapMessage();
// createSwapMultihopMessage();

// createMintMessage();
