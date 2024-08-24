import { NextApiRequest, NextApiResponse } from "next";
import { register, collectDefaultMetrics } from "prom-client";

collectDefaultMetrics({});

export default async function handler(_: NextApiRequest, res: NextApiResponse<any>) {
    res.setHeader('Content-type', register.contentType);
    res.send(await register.metrics());
}