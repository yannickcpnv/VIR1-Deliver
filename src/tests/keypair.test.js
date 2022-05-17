const KeyPair = require("../KeyPair.js");
const KeyPairNotFoundException = require('../exceptions/KeyPairNotFoundException.js');

describe('KeyPair', () => {
    test('findByName_BasicCase_Success', async () => {
        // Given
        const expectedKeyId = 'key-05c59bb0609bc8db5';
        const expectedKeyName = 'test';

        // When
        const key = await KeyPair.findByName(expectedKeyName);

        // Then
        expect(key.id).toEqual(expectedKeyId);
        expect(key.name).toEqual(expectedKeyName);
    });

    test('findByName_NonExistingName_ThrowException', async () => {
        // Given
        const expectedKeyName = 'does-not-exist';

        // When
        expect(async () => KeyPair.findByName(expectedKeyName)).rejects.toThrow(KeyPairNotFoundException);

        // Then
        // Exception is thrown
    });

    test('findById_BasicCase_Success', async () => {
        // Given
        const expectedKeyId = 'key-05c59bb0609bc8db5';
        const expectedKeyName = 'test';

        // When
        const key = await KeyPair.findById(expectedKeyId);

        // Then
        expect(key.id).toEqual(expectedKeyId);
        expect(key.name).toEqual(expectedKeyName);
    });

    test('findById_NonExistingId_ThrowException', async () => {
        // Given
        const expectedKeyId = 'key-which-does-not-exist';

        // When
        expect(async () => await KeyPair.findById(expectedKeyId)).rejects.toThrow(KeyPairNotFoundException);

        // Then
        // Exception is thrown
    });
});
