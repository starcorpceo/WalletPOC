import { FastifyInstance } from "fastify";
import { TankAddressResponse, TankBalanceResponse } from "./gasless";
import { fetchTankAddress, fetchTankBalance } from "./gasless.service";

const getTankBalance = async (): Promise<TankBalanceResponse> => {
  return await fetchTankBalance();
};

const getTankAddress = (): TankAddressResponse => {
  return fetchTankAddress();
};

const registerGaslessRoutes = (server: FastifyInstance) => {
  server.get("/gasless/tankBalance", getTankBalance);
  server.get("/gasless/tankAddress", getTankAddress);
};

export default registerGaslessRoutes;
