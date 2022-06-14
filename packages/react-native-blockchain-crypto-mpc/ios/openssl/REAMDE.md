## OpenSSL

So far, we were not able to load openSSL from the local FileSystem on ios.
For this reason we included the library files directly into the Project.

The included files have a specific compilation Target. They will either be compatible with iOS Devices *or* iOS Simulators.
The folders `include` and `lib` currently contain the compiled library for iOS Simulators.

For this reason the folder `openssl-ios`  is included into the project. In case the Library should run on a ios-device instead of an emulator just replace the `include` and `lib` folders with the content of `openssl-ios` and the lib will be able to run on ios devices.

