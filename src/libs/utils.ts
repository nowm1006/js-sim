export function getUid(): string {
    return Date.now().toString(16) + (Math.random() * 1000).toString(16)
}

export class Vec2 {
    constructor(public x: number, public y: number) {}

    add(vec: Vec2) {
        this.x += vec.x
        this.y += vec.y
        return this
    }

    sub(vec: Vec2) {
        this.x -= vec.x
        this.y -= vec.y
        return this
    }

    mulScalar(scalar: number) {
        this.x *= scalar
        this.y *= scalar
        return this
    }
}
