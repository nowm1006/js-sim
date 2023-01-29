import { Source } from './base'

type StepProps = {
    name?: string
    tStep?: number
    yInitial?: number
    yFinal?: number
}

export class Step extends Source {
    tStep: number
    yInitial: number
    yFinal: number

    constructor({ name, tStep = 1, yInitial = 0, yFinal = 1 }: StepProps = {}) {
        super({ name })
        this.tStep = tStep
        this.yInitial = yInitial
        this.yFinal = yFinal
    }

    get(t: number): number {
        if (t >= this.tStep) {
            return this.yFinal
        } else {
            return this.yInitial
        }
    }
}

type ConstProps = {
    name?: string
    value?: number
}

export class Const extends Source {
    value: number

    constructor({ name, value = 1 }: ConstProps = {}) {
        super({ name })
        this.value = value
    }
    get(t: number): number {
        return this.value
    }
}
