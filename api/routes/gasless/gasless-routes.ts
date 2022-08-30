import { nonceRoute } from "@lib/route";
import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import { GaslessPermitRequest, GaslessPermitResponse, TankAddressResponse, TankBalanceResponse } from "./gasless";
import { fetchTankAddress, fetchTankBalance, relayGaslessPermit } from "./gasless.service";

const getTankBalance = async (): Promise<TankBalanceResponse> => {
  return await fetchTankBalance();
};

const getTankAddress = (): TankAddressResponse => {
  return fetchTankAddress();
};

const postRelayGaslessPermit = nonceRoute<GaslessPermitResponse>((req: FastifyRequest) => {
  return relayGaslessPermit(req.body as GaslessPermitRequest);
});

const registerGaslessRoutes = (server: FastifyInstance) => {
  server.get("/gasless/tankBalance", getTankBalance);
  server.get("/gasless/tankAddress", getTankAddress);
  server.post("/gasless/relayPermit", { schema: relayGaslessPermitSchema }, postRelayGaslessPermit);
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

export default registerGaslessRoutes;
