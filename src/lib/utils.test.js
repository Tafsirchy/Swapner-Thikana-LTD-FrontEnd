import { cn } from './utils';
import { describe, expect, test } from '@jest/globals';

describe('Utility Functions', () => {
    test('cn() combines class names correctly', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    test('cn() resolves tailwind conflicts', () => {
        expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });

    test('cn() handles conditional classes', () => {
        const isTrue = true;
        const isFalse = false;
        expect(cn('base', isTrue && 'active', isFalse && 'inactive')).toBe('base active');
    });

    test('cn() handles undefined and null', () => {
        expect(cn('base', undefined, null, 'active')).toBe('base active');
    });
});
