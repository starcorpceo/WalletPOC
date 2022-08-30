import { nonceRoute } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import {
  GaslessApproveRequest,
  GaslessPermitRequest,
  GaslessTransactionResponse,
  GaslessTransferRequest,
  GaslessTransferWithAuthorizationRequest,
  TankAddressResponse,
  TankBalanceResponse,
} from "./gasless";
import {
  fetchTankAddress,
  fetchTankBalance,
  relayGaslessPermit,
  relayGaslessTransfer,
  relayGaslessTransferWithAuthorization,
  gaslessApprove,
} from "./gasless.service";

const getTankBalance = async (): Promise<TankBalanceResponse> => {
  return await fetchTankBalance();
};

const getTankAddress = (): TankAddressResponse => {
  return fetchTankAddress();
};

const postRelayGaslessApprove = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return gaslessApprove(req.body as GaslessApproveRequest);
});

const postRelayGaslessPermit = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return relayGaslessPermit(req.body as GaslessPermitRequest);
});

const postRelayGaslessTransfer = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return relayGaslessTransfer(req.body as GaslessTransferRequest);
});

const postRelayGaslessTransferWithAuthorization = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return relayGaslessTransferWithAuthorization(req.body as GaslessTransferWithAuthorizationRequest);
});

const registerGaslessRoutes = (server: FastifyInstance) => {
  server.get("/gasless/tankBalance", getTankBalance);
  server.get("/gasless/tankAddress", getTankAddress);
  server.post("/gasless/approve", { schema: relayGaslessApproveSchema }, postRelayGaslessApprove);
  server.post("/gasless/relayPermit", { schema: relayGaslessPermitSchema }, postRelayGaslessPermit);
  server.post("/gasless/relayTransfer", { schema: relayGaslessTransferSchema }, postRelayGaslessTransfer);
  server.post(
    "/gasless/relayTransferWithAuthorization",
    { schema: relayGaslessTransferWithAuthorizationSchema },
    postRelayGaslessTransferWithAuthorization
  );
};

const relayGaslessApproveSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["contractAddress", "receiver"],
    properties: {
      contractAddress: { type: "string", maxLength: 44, minLength: 20 },
      receiver: { type: "string", maxLength: 44, minLength: 40 },
    },
  },
};

const relayGaslessPermitSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["contractAddress", "owner", "spender", "value", "deadline", "v", "r", "s"],
    properties: {
      contractAddress: { type: "string", maxLength: 44, minLength: 20 },
      owner: { type: "string", maxLength: 44, minLength: 40 },
      spender: { type: "string", maxLength: 44, minLength: 40 },
      value: { type: "string" },
      deadline: { type: "number" },
      v: { type: "number" },
      r: { type: "string" },
      s: { type: "string" },
    },
  },
};

const relayGaslessTransferSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["contractAddress", "from", "to", "value"],
    properties: {
      contractAddress: { type: "string", maxLength: 44, minLength: 20 },
      from: { type: "string", maxLength: 44, minLength: 40 },
      to: { type: "string", maxLength: 44, minLength: 40 },
      value: { type: "string" },
    },
  },
};

const relayGaslessTransferWithAuthorizationSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["contractAddress", "from", "to", "value", "validAfter", "validBefore", "nonce", "v", "r", "s"],
    properties: {
      contractAddress: { type: "string", maxLength: 44, minLength: 20 },
      from: { type: "string", maxLength: 44, minLength: 40 },
      to: { type: "string", maxLength: 44, minLength: 40 },
      value: { type: "string" },
      validAfter: { type: "number" },
      validBefore: { type: "number" },
      nonce: { type: "string" },
      v: { type: "number" },
      r: { type: "string" },
      s: { type: "string" },
    },
  },
};

export default registerGaslessRoutes;
