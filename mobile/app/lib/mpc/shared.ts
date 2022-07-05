export type ActionStatus = "Init" | "Stepping";

// const authenticatedMpc =
//   (userId: string, devicePublicKey: string) =>
//   async (path: string, onMessage: () => void, onOpen: () => void) => {
//     const { nonce } = await fetchFromApi<CreateNonceResponse>("/getNonce");

//     const deviceSignature = await signWithDeviceKey(nonce);

//     const ws = new WebSocket(getApiUrl("ws") + path, undefined, {
//       headers: {
//         userId,
//         devicePublicKey,
//         deviceSignature,
//       },
//     });

//     return new Promise((res, rej) => {
//       ws.onopen = onOpen;
//       ws.onmessage = onMessage;
//       ws.onerror = (err) => rej(err);
//     });
//   };
