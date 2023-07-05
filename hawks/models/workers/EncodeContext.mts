import { Job } from 'bullmq'

import { getInputFilepathSync } from '../../utils/fileSupport.mjs'
import { MediaData } from '../encoders/MediaData.mjs'

import { EncodeData } from './EncodeData.mjs'

export type EncodeScopeContext = {
	currentStep: number
	maxStep: number
	progressRatio: number
	progressWeight: number
}

export class EncodeContext<JobData extends EncodeData, TData extends MediaData> {
	/**
	 * BullMQ Job
	 */
	#job: Job<JobData>

	/**
	 * Media data
	 */
	#data: TData

	/**
	 * Input filepath
	 */
	#filepath: string

	/**
	 * Base progress
	 */
	#baseProgress = 0

	/**
	 * Scope context
	 */
	#scope: EncodeScopeContext[] = [{
		currentStep: 0,
		maxStep: 1,
		progressRatio: 100,
		progressWeight: 0,
	}]

	/**
	 * @param job      The BullMQ Job
	 * @param data     The encode Data
	 * @param filepath The target file path
	 */
	constructor(job: Job<JobData>, data: TData, filepath?: string) {
		this.#job = job
		this.#data = data
		this.#filepath = filepath ?? getInputFilepathSync(job.data)
	}

	log(line: string): Promise<number> {
		return this.#job.log(line)
	}

	/**
	 * Create new scope for encode.
	 * @param step   The step count
	 * @param weight The progress weight of this scope
	 * @returns      Created scope context
	 */
	scope(step: number, weight = 0): EncodeScopeContext {
		const scope: EncodeScopeContext = {
			currentStep: 0,
			maxStep: step,
			progressRatio: this.#scope[0].progressRatio,
			progressWeight: weight,
		}
		if (weight > 0 && weight !== 1) {
			// [Note] Geometric sequence | 等比数列
			const sum = (1 - Math.pow(weight, step)) / (1 - weight)
			scope.progressRatio /= sum
		} else if (weight < 0) {
			// [Note] Arithmetic sequence | 等差数列
			const sum = 0.5 * (2 + (step - 1) * -weight) * step
			scope.progressRatio /= sum
		} else {
			scope.progressRatio /= step
		}
		this.#scope.unshift(scope)
		return scope
	}

	/**
	 * Restore previous scope for encode.
	 * @returns Removed scope context.
	 */
	restore(): EncodeScopeContext {
		if (this.#scope.length <= 1) {
			throw Error('This operation is forbidden. This scope is top-level.')
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.#scope.shift()!
	}

	/**
	 * Start new step.
	 * @param i The step index
	 */
	start(i?: number) {
		if (typeof i === 'number') {
			this.#scope[0].currentStep = i
		} else {
			++this.#scope[0].currentStep
		}
	}

	updateProgress(progress: number): Promise<void> {
		const progressRatio = 0.1 * Math.round(10 * this.#currentProgressRatio * progress)
		return this.#job.updateProgress(this.#baseProgress + progressRatio)
	}

	/**
	 * Finish the current step.
	 * @returns The promise of updating progress
	 */
	done() {
		const progressRatio = this.#currentProgressRatio
		this.#baseProgress += progressRatio
		return this.#job.updateProgress(0.1 * Math.round(10 * this.#baseProgress))
	}

	get job(): Job<JobData> {
		return this.#job
	}

	get data(): TData {
		return this.#data
	}

	get filepath(): string {
		return this.#filepath
	}

	get currentScope(): Readonly<EncodeScopeContext> {
		return this.#scope[0]
	}

	get #currentProgressRatio() {
		const scope = this.#scope[0]
		if (scope.progressWeight > 0 && scope.progressWeight !== 1) {
			return scope.progressRatio * Math.pow(scope.progressWeight, scope.currentStep)
		} else if (scope.progressWeight < 0) {
			return scope.progressRatio * (1 + scope.currentStep) * -scope.progressWeight
		} else {
			return scope.progressRatio
		}
	}
}
