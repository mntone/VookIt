
export type EncodeData = {
	id: string
	ext: string
}

export type VariantFlowEncodeData = EncodeData & {
	type: 'variant'
	variantId: number
}

export type FlowEncodeData = EncodeData & {
	cursor: number
}

export type CodecFlowEncodeData = FlowEncodeData & {
	type: 'codec'
	codecId: number
}

export type SpecifiedFlowEncodeData = CodecFlowEncodeData | VariantFlowEncodeData
