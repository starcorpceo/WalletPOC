cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)
set(LIB_DIR ../cpp/src/src/)


add_library(cpp
            SHARED
            ../cpp/src/src/example.cpp
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../cpp/src/include
)
