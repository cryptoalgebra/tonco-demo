#!/bin/bash


kotlinc \
    src/main/Main.kt \
    src/main/TickMath.kt \
    src/main/SwapMath.kt \
    src/main/SqrtPriceMath.kt \
    src/main/Swap.kt \
    src/main/SwapDirection.kt  -include-runtime -d SwapSimulate.jar
java -jar SwapSimulate.jar