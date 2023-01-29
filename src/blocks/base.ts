abstract class BaseBlock {
    static count: number = 0
    readonly uid: number
    readonly name: string

    constructor({ name }: { name?: string } = {}) {
        BaseBlock.count += 1
        this.uid = BaseBlock.count
        this.name = name || `ID${this.uid}`
    }
}

abstract class Source extends BaseBlock {
    abstract get(t: number): number
}

abstract class Sink extends BaseBlock {
    static instances: Sink[] = []
    inputs: (Source | Block)[] = []

    constructor({ name }: { name?: string } = {}) {
        super({ name })
        Sink.instances.push(this)
    }

    connect(...inputs: (Source | Block)[]): void {
        this.inputs = [...this.inputs, ...inputs]
    }

    abstract get(t: number): void
}

abstract class Block extends Sink {
    abstract get(t: number): number
}

export { Source, Sink, Block }
