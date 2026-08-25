CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -I./src/cpp
BUILD_DIR = bin
SRC_DIR = src/cpp

SRCS = $(SRC_DIR)/WhotGameEngine.cpp $(SRC_DIR)/main.cpp
OBJS = $(BUILD_DIR)/WhotGameEngine.o $(BUILD_DIR)/main.o
TARGET = $(BUILD_DIR)/whot_game_cli

# Emscripten target for KaiOS low-RAM legacy devices (asm.js output via -s WASM=0)
EMCC = emcc
EMFLAGS = -std=c++17 -O2 -I./src/cpp -s WASM=0 -s SINGLE_FILE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1
ASM_TARGET = public/whot_engine_asm.js

all: $(TARGET) asmjs

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $(TARGET)

asmjs: $(SRCS)
	@mkdir -p public
	@which emcc > /dev/null 2>&1 && $(EMCC) $(EMFLAGS) $(SRCS) -o $(ASM_TARGET) || echo "emcc not found locally; will compile via GitHub Actions workflow"

clean:
	rm -rf $(BUILD_DIR) $(ASM_TARGET)

run: $(TARGET)
	./$(TARGET)

.PHONY: all clean run asmjs
