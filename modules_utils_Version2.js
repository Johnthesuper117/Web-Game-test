export class Utils {
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    static vectorAdd(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
    }

    static vectorSubtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }

    static vectorScale(v, scalar) {
        return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
    }

    static vectorLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    static normalizeVector(v) {
        const length = this.vectorLength(v);
        return length > 0 ? this.vectorScale(v, 1 / length) : { x: 0, y: 0, z: 0 };
    }
}