import { Job } from 'bullmq'

import { getInputFilepathSync } from '../../utils/fileSupport.mjs'
import { MediaData } from '../encoders/MediaData.mjs'

import { EncodeData } from './EncodeData.mjs'

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
	 * Progress ratio
	 */
	#progressRatio = 100

	/**
	 * @param job
	 * @param data
	 * @param filepath
	 */
	constructor(job: Job<JobData>, data: TData, filepath?: string) {
		this.#job = job
		this.#data = data
		this.#filepath = filepath ?? getInputFilepathSync(job.data)
	}

	log(line: string): Promise<number> {
		return this.#job.log(line)
	}

	updateProgress(progress: number): Promise<void> {
		return this.#job.updateProgress(this.#baseProgress + this.#progressRatio * 0.1 * Math.round(10 * progress))
	}

	done() {
		this.#baseProgress += this.#progressRatio
		return this.#job.updateProgress(this.#baseProgress)
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

	get progressRatio(): number {
		return this.#progressRatio
	}
	set progressRatio(value: number) {
		if (value > 100) {
			throw Error('This value is less than or equal to 100.')
		}
		this.#progressRatio = value
	}
}
