import { Block, Source } from './base'
import { Vec2 } from '../libs/utils'

type DynamicsProps = {
    name?: string
    y0?: number
}

abstract class Dynamics extends Block {
    cache: Record<number, number>

    constructor({ name, y0 = 0 }: DynamicsProps = {}) {
        super({ name })
        this.cache = { 0: y0 }
    }

    get(t: number) {
        if (t in this.cache) {
            return this.cache[t]
        } else {
            const ts = +Object.keys(this.cache).at(-1)!
            const ys = +Object.values(this.cache).at(-1)!
            const u = this.inputs[0]?.get(ts)!

            const dt = t - ts
            const dy1 = this.eom(ys, u)
            const dy2 = this.eom(ys + dy1 * dt, u)
            const dy = (dy1 + dy2) / 2
            const y = ys + dy * dt
            this.cache[t] = y
            return y
        }
    }

    abstract eom(y: number, u: number): number
}

type FirstOrderDelayProps = {
    name: string
    K: number
    T: number
    y0: number
}

export class FirstOrderDelay extends Dynamics {
    K: number
    T: number

    constructor({ name, K = 1, T = 1, y0 }: Partial<FirstOrderDelayProps> = {}) {
        super({ name, y0 })
        this.K = K
        this.T = T
    }

    eom(y: number, u: number): number {
        return (-1 / this.T) * y + (this.K / this.T) * u
    }
}

export class Integrate extends Dynamics {
    constructor({ name }: { name?: string }) {
        super({ name })
    }

    eom(y: number, u: number): number {
        return u
    }
}

abstract class VectorDynamics extends Block {
    cache: Record<number, Vec2>

    constructor({ name, x0 }: { name?: string; x0: Vec2 }) {
        super({ name })
        this.cache = { 0: x0 }
    }

    get(t: number) {
        if (t in this.cache) {
            return this.outputEquation(this.cache[t])
        } else {
            const ts = +Object.keys(this.cache).at(-1)!
            const xs = Object.values(this.cache).at(-1)!
            const u = this.inputs[0]?.get(ts)!

            const dt = t - ts
            const dxdt = this.stateEquation(xs, u)
            const dx = dxdt.mulScalar(dt)
            const x = dx.add(xs)
            const y = this.outputEquation(x)
            this.cache[t] = new Vec2(x.x, x.y)
            return y
        }
    }

    abstract stateEquation(x: Vec2, u: number): Vec2
    abstract outputEquation(x: Vec2): number
}

type MassDamperArgs = {
    name: string
    m: number
    k: number
    d: number
    x0: Vec2
}

export class MassDamper extends VectorDynamics {
    m: number
    k: number
    d: number

    constructor({ name, m = 1, k = 1, d = 1, x0 = new Vec2(0, 0) }: Partial<MassDamperArgs>) {
        super({ name, x0 })
        this.m = m
        this.k = k
        this.d = d
    }

    stateEquation(x: Vec2, u: number): Vec2 {
        const dx = new Vec2(0, 0)
        dx.x = x.y
        dx.y = (-this.k / this.m) * x.x - (this.d / this.m) * x.y + (1 / this.m) * u
        return dx
    }

    outputEquation(x: Vec2): number {
        return x.x
    }
}

export class Gain extends Block {
    K: number

    constructor({ name, K }: { name?: string; K: number }) {
        super({ name })
        this.K = K
    }

    get(t: number): number {
        return this.inputs[0].get(t) * this.K
    }
}

export class Sum extends Block {
    get(t: number): number {
        let res = 0
        this.inputs.forEach((input) => {
            res += input.get(t)
        })
        return res
    }
}
