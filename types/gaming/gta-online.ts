export interface GTAOnlinePageProps {
	summary: (GTASummaryCount | GTASummaryDate | GTASummaryMoney)[];
	wishList: GTAWishListEntry[];
	crateWarehouses: GTACrateWarehouse[];
	properties: GTAProperty[];
	earnings: {
		summary: GTAEarningsSummary;
		detail: GTAEarningsRow[];
	};
}

export interface GTACrateWarehouse {
	warehouseName: string;
	crates: number;
	filmReels: number;
	rareHides: number;
	goldenMiniguns: number;
	ornamentalEggs: number;
	largeDiamonds: number;
	rarePocketWatches: number;
	totalItems: number;
	totalValue: number;
	crateValue: number;
	specialItemValue: number;
	raidLimit: number;
	fullLimit: number;
}

export interface GTAEarningsSummary {
	maxBalance: number;
	maxEarnings: number;
}

export interface GTAEarningsRow {
	balanceDate: Date;
	balance: number;
	earnings: number;
}

export interface GTAGarageFloor {
	name: string;
	vehicles: GTAVehicle[];
}

export interface GTAProperty extends GTAVehicle {
	location: string;
	type: string;
	garage: GTAGarageFloor[];
}

export interface GTASummaryMoney {
	name: string;
	type: "Money";
	gtaDollars: number;
	sharkCardAmount: number;
}

export interface GTASummaryCount {
	name: string;
	type: "Count";
	count: number;
	total: number;
}

export interface GTASummaryDate {
	name: string;
	type: "Date";
	date: Date;
}

export interface GTAVehicle {
	name: string;
	cost: number;
	gtaWikiLink: string;
	gtaBaseLink: string;
}

export interface GTAWishListEntry {
	name: string;
	buyAt: string;
	totalCost: number;
	remainingCost: number;
	totalGrindDays: number;
	remainingGrindDays: number;
}
