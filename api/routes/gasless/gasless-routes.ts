import { nonceRoute } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import {
  GaslessPermitRequest,
  GaslessTransactionResponse,
  GaslessTransferRequest,
  TankAddressResponse,
  TankBalanceResponse,
} from "./gasless";
import { fetchTankAddress, fetchTankBalance, relayGaslessPermit, relayGaslessTransfer } from "./gasless.service";

const getTankBalance = async (): Promise<TankBalanceResponse> => {
  return await fetchTankBalance();
};

const getTankAddress = (): TankAddressResponse => {
  return fetchTankAddress();
};

const postRelayGaslessPermit = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return relayGaslessPermit(req.body as GaslessPermitRequest);
});

const postRelayGaslessTransfer = nonceRoute<GaslessTransactionResponse>((req: FastifyRequest) => {
  return relayGaslessTransfer(req.body as GaslessTransferRequest);
});

const registerGaslessRoutes = (server: FastifyInstance) => {
  server.get("/gasless/tankBalance", getTankBalance);
  server.get("/gasless/tankAddress", getTankAddress);
  server.post("/gasless/relayPermit", { schema: relayGaslessPermitSchema }, postRelayGaslessPermit);
  server.post("/gasless/relayTransfer", { schema: relayGaslessTransferSchema }, postRelayGaslessTransfer);
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

export default registerGaslessRoutes;
