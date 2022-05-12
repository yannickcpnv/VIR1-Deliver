const Vpc = require("../Vpc.js");
const VpcNotFoundException = require('../exceptions/VpcNotFoundException.js');

test('describeVpcWithSubnets_ExistingVpcHavingSubnet_Success', async () => {
    // Given
    const expectedVpcId = 'vpc-08584e8bf7e83d040';
    const expectedVpcIpRange = '10.0.0.0/24';
    const expectedSubnetIds = ['subnet-00ebe6783616bc17c'];

    // When
    const vpc = await Vpc.find(expectedVpcId);

    // Then
    expect(vpc.id).toEqual(expectedVpcId);
    expect(vpc.ipRange).toEqual(expectedVpcIpRange);

    vpc.subnets.forEach(subnet => {
        expect(subnet.id).toEqual(expectedSubnetIds.shift());
    });
});

test('describeVpcWithSubnets_NonExistingVpc_ThrowException', () => {
    // Given
    const wrongVpcId = 'yad7asdko6kokp512qo2';

    // When
    expect(async () => await Vpc.find(wrongVpcId)).rejects.toThrow(VpcNotFoundException);

    // Then
    // Exception is thrown
});

test('securityGroups_ExistingVpc_Success', async () => {
    // Given
    const expectedVpcId = 'vpc-08584e8bf7e83d040';
    const vpc = await Vpc.find(expectedVpcId);

    // When
    const securityGroups = await vpc.securityGroups;

    // Then
    expect(securityGroups.length).toBeGreaterThan(0);
});
