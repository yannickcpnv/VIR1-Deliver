"use strict";

const DescribeInfra = require("../DescribeInfra");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException");

describe("DescribeInfra", () => {
    /** @type {DescribeInfra} */
    let describeInfra;
    jest.setTimeout(30000);

    beforeEach(() => {
        describeInfra = new DescribeInfra();
    });

    test('describe_AllInfra_Success', async () => {
        // Given
        const vpcName = "vpc-paris";
        const expectedType = 'string';

        // When
        const infra = await describeInfra.describe(vpcName);

        // Then
        expect(typeof infra).toBe(expectedType);
        const infraJson = JSON.parse(infra);
        expect(infraJson.vpcName).toBe(vpcName);
        expect(infraJson.vpcCidr).toBeDefined();
        expect(infraJson.igwName).toBeDefined();
        expect(infraJson.subnets.length).toBeGreaterThan(0);
        expect(infraJson.securityGroups.length).toBeGreaterThan(0);
        expect(infraJson.keyPairs.length).toBeGreaterThan(0);
        expect(infraJson.instances.length).toBeGreaterThan(0);
    });

    test('describe_NotExistingVpc_Success', async () => {
        // Given
        const vpcName = "vpc-not-existing";

        // when
        await expect(describeInfra.describe(vpcName)).rejects.toThrow(VpcNotFoundException);

        // Then
        // Exception is thrown
    });
});
