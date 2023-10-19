import { get } from "https";
import getObjectAsJsonString from "../../io/object_as_json_string";
import { SummaryDTO } from "../../types/dtos";
import { Transaction, TransactionType } from "../../types/ledger_file";
import {
  isExpenseFilter,
  isIncomeFilter,
  isMonthAndYearFilter,
} from "./filters";

export function getMonthIncomeAcc(
  data: Transaction[],
  month: number,
  year: number
) {
  const sum = data
    .filter(isIncomeFilter)
    .filter((item) => isMonthAndYearFilter(item, month, year))
    .reduce((acc, item) => {
      const itemVal = item.amount;
      acc += itemVal;
      return acc;
    }, 0);
  return sum.toFixed(2);
}

export function getIncomingAccGroupedByAsset(
  data: Transaction[]
): SummaryDTO[] {
  let assetsAcc: { [key: string]: number } = {};
  const assets = groupItemsByAsset(data, TransactionType.INCOME);
  for (const asset in assets) {
    const balance = assets[asset].reduce((acc, item) => acc + item.amount, 0);
    assetsAcc[asset] = balance;
  }
  return getHierarchyAssetsSummary(assetsAcc);
}

export function getMonthExpansesAcc(
  data: Transaction[],
  month: number,
  year: number
) {
  const sum = data
    .filter(isExpenseFilter)
    .filter((item) => isMonthAndYearFilter(item, month, year))
    .reduce((acc, item) => {
      const itemVal = item.amount;
      acc += itemVal;
      return acc;
    }, 0);
  return sum.toFixed(2);
}

function groupItemsByAsset(data: Transaction[], source: TransactionType) {
  const assets: { [key: string]: Transaction[] } = {};
  data.forEach((item: Transaction) => {
    // slipt asset name from item name as :
    let assetPath: string[] = [];
    if (source === TransactionType.INCOME) {
      assetPath = item.from.split(":");
    } else if (source === TransactionType.EXPENSE) {
      assetPath = item.to.split(":");
    }
    for (let i = 0; i < assetPath.length; i++) {
      // name is the join of all asset path until i
      const assetName: string = assetPath.slice(0, i + 1).join(":");
      if (!assets[assetName]) {
        assets[assetName] = [];
      }
      assets[assetName].push(item);
    }
  });
  // sort by key
  const sortedAssets: { [key: string]: Transaction[] } = {};
  Object.keys(assets)
    .sort()
    .forEach((key) => {
      sortedAssets[key] = assets[key];
    });
  return sortedAssets;
}

export function getExpenseAccGroupedByAsset(data: Transaction[]): SummaryDTO[] {
  let assetsAcc: { [key: string]: number } = {};
  const assets = groupItemsByAsset(data, TransactionType.EXPENSE);
  for (const asset in assets) {
    const balance: number = assets[asset].reduce(
      (acc, item) => acc + Number(item.amount),
      0
    );
    assetsAcc[asset] = balance;
  }
  return getHierarchyAssetsSummary(assetsAcc);
}

function getHierarchyAssetsSummary(assets: {
  [key: string]: number;
}): SummaryDTO[] {
  let hierarchyAssets: SummaryDTO[] = [];

  for (const asset in assets) {
    const assetPath = asset.split(":");
    const assetName = assetPath.slice(-1)[0];
    const assetBalance = assets[asset];

    // if asset has no parent
    if (assetPath.length === 1) {
      hierarchyAssets.push({
        asset: assetName,
        balance: assetBalance,
      });
    } else {
      // if asset has parent
      const parentAssetPath = assetPath.slice(0, -1);
      const parentAssetName = parentAssetPath.slice(-1)[0];
      // deep search for parent asset
      const parentAsset = findAssetByName(hierarchyAssets, parentAssetName);
      // if parent asset was found, add child
      if (parentAsset) {
        if (!parentAsset.children) parentAsset.children = [];
        parentAsset.children.push({
          asset: assetName,
          balance: assetBalance,
        });
      }
    }
  }
  return hierarchyAssets;
}
// deep search to findAssetByName
function findAssetByName(
  assets: SummaryDTO[],
  name: string
): SummaryDTO | undefined {
  let assetFound: SummaryDTO | undefined = undefined;
  assets.forEach((asset) => {
    if (asset.asset === name) {
      assetFound = asset;
    } else if (asset.children && asset.children.length > 0) {
      assetFound = findAssetByName(asset.children, name);
    }
  });
  return assetFound;
}
