export interface GTAOnlinePageProps {
	summary: {
		money: GTASummaryMoney[];
		grindDays: number;
		grindWeeks: number;
		grindDaysRemaining: number;
		grindWeeksRemaining: number;
		averageGrindDays: number;
		wishListCompletionDate: Date;
		daysPlayed: number;
	};
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
