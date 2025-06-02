# TONCO Examples

TypeScript examples of SDK usage, including dependency installation, script execution, and swap operation simulations.

## 📦 Installation

Make sure ts-node is installed if you're working with TypeScript:

```bash
npm install -g ts-node
```

Using npm:

```bash
cd sdk_examples
npm install
```

or yarn:

```bash
cd sdk_examples
yarn install
```

## 🚀 Getting Started

TypeScript examples of SDK usage can be found in the sdk_examples directory. To run a specific script:

### Using npm scripts:

```bash
npm run dev                # Run index.ts
npm run estimate-swap-exact-in      # Estimate exact-in swap
npm run estimate-swap-exact-out     # Estimate exact-out swap
npm run estimate-swap-exact-in-multihop   # Estimate exact-in multihop swap
npm run estimate-swap-exact-out-multihop  # Estimate exact-out multihop swap

npm run create-swap-message         # Create swap message
npm run create-swap-multihop-message # Create multihop swap message

npm run create-mint-message         # Create mint message
```

### Running manually:

```bash
ts-node <script_name>.ts
```

## 📄 Examples

The sdk_examples directory contains example scripts demonstrating how to use the SDK. You can explore and adapt them to your needs.
