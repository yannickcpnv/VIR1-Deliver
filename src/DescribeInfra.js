"use strict";

const VpcHelper = require("./VpcHelper");
const SubnetHelper = require("./SubnetHelper");
const SecurityGroupHelper = require("./SecurityGroupHelper");
const InstanceHelper = require("./InstanceHelper");
const KeypairHelper = require("./KeypairHelper");

module.exports = class DescribeInfra {
    //region public methods

    /**
     * @brief Describe the infrastructure
     * @param name {string} name of a VPC
     * @returns Promise<string>
     */
    async describe(name) {
        const subnetHelper = new SubnetHelper();

        const vpc = await new VpcHelper().describe(name);

        const subnets = await subnetHelper.describe(name);
        const subnetsMapped = await Promise.all(subnets.map(async (subnet) => await this.#mapSubnet(subnet, subnetHelper)));

        const securityGroups = await new SecurityGroupHelper().describe(vpc.Name);
        const securityGroupsMapped = securityGroups.map(this.#mapSecurityGroup);

        const keyPairs = await new KeypairHelper().describe();
        const keyPairsMapped = keyPairs.map(this.#mapKeyPair);

        const instances = await new InstanceHelper().describe(vpc.VpcId);
        const instancesMapped = instances.map(this.#mapInstance);

        const infra = this.#lowerKeysFirstCharRecursive({
            vpcName: vpc.Name,
            vpcCidr: vpc.CidrBlock,
            igwName: vpc.Igw?.Name,
            subnets: subnetsMapped,
            securityGroups: securityGroupsMapped,
            keyPairs: keyPairsMapped,
            instances: instancesMapped,
        });

        return JSON.stringify(infra, null, 4);
    }

    async #mapSubnet(subnet, subnetHelper) {
        return {
            subnetName: subnet.Tags.find((tag) => tag.Key === "Name").Value,
            subnetCidr: subnet.CidrBlock,
            availabilityZone: subnet.AvailabilityZone,
            routeTables: await subnetHelper.routeTables(subnet),
        };
    }

    #mapSecurityGroup(securityGroup) {
        return {
            securityGroupName: securityGroup.GroupName,
            inboundSecurityRules: securityGroup.InboundSecurityRules,
            outboundSecurityRules: securityGroup.OutboundSecurityRules,
        };
    }

    #mapKeyPair(keypair) {
        return {
            keyPairsName: keypair.KeyName,
            type: keypair.KeyType,
        };
    }

    #mapInstance(instance) {
        return {
            instanceName: instance.Tags.find(tag => tag.Key === "Name").Value,
            instancePublicIp: instance.PublicIpAddress || "",
            instancePrivateIp: instance.PrivateIpAddress,
            instanceType: instance.InstanceType,
            plateform: instance.PlatformDetails,
            amiId: instance.ImageId,
            terminationProtection: "",
            usageOperation: instance.UsageOperation,
            SecurityGroupsName: instance.SecurityGroups.map(sg => sg.GroupName),
            keyName: instance.KeyName,
        };
    }

    #lowerKeysFirstCharRecursive(obj) {
        if (obj === null || typeof obj !== "object") return obj;

        let newObjOrArray = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            const newKey = key.charAt(0).toLowerCase() + key.slice(1);
            newObjOrArray[newKey] = this.#lowerKeysFirstCharRecursive(obj[key]);
        }

        return newObjOrArray;
    }

    //endregion public methods
};
