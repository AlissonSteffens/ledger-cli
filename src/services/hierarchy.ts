import { HierarchyAsset } from "../types/assets";
import { Transaction } from "../types/ledger_file";

/**
 * This function takes a list of transactions and returns a list of assets in a hierarchical structure.
 *
 * @param data - A list of transactions. Each transaction has a 'from' field and a 'to' field which are strings representing assets.
 *
 * @returns A list of assets in a hierarchical structure. Each asset is represented by an object with an 'asset' field 
 * and an optional 'children' field. The 'asset' field is a string representing the asset. 
 * The 'children' field is a list of assets that are children of the current asset in the hierarchy.
 *
 * @example
 *
 * const transactions = [
 *   { from: 'asset1:subasset1', to: 'asset2:subasset2' },
 *   { from: 'asset1:subasset1:subsubasset1', to: 'asset2' },
 *   { from: 'asset3', to: 'asset1:subasset1:subsubasset1' },
 * ];
 *
 * const hierarchyAssets = getHierarchyAssets(transactions);
 *
 * console.log(hierarchyAssets);
 * // Output:
 * // [
 * //   { asset: 'asset1', children: [
 * //     { asset: 'subasset1', children: [
 * //       { asset: 'subsubasset1' }
 * //     ] }
 * //   ] },
 * //   { asset: 'asset2', children: [
 * //     { asset: 'subasset2' }
 * //   ] },
 * //   { asset: 'asset3' }
 * // ]
 */
export default function getHierarchyAssets(
  data: Transaction[]
): HierarchyAsset[] {
  // Extract all 'from' and 'to' fields from the transactions
  const allFromStrings = data.map((item: Transaction) => item.from);
  const allToStrings = data.map((item: Transaction) => item.to);

  // Combine all asset strings and remove duplicates
  const allAssetsStrings = [...allFromStrings, ...allToStrings];
  const allUniqueAssets: string[] = [...new Set(allAssetsStrings)];

  // Initialize the hierarchy assets array
  const hierarchyAssets: HierarchyAsset[] = [];

  // For each unique asset, build its hierarchy
  allUniqueAssets.forEach((asset) => {
    const allAssetLevels = asset.split(":");
    let currentLevel = hierarchyAssets;

    allAssetLevels.forEach((assetLevel) => {
      const assetLevelIndex = currentLevel.findIndex(
        (item) => item.asset === assetLevel
      );

      // If the asset level is not found, add it
      if (assetLevelIndex === -1) {
        currentLevel.push({ asset: assetLevel, children: [] });
      }

      // Find the index of the asset level after insertion
      const assetLevelIndexAfterInsert = currentLevel.findIndex(
        (item) => item.asset === assetLevel
      );

      // Update the current level to be the children of the current asset level
      currentLevel = currentLevel[assetLevelIndexAfterInsert].children!;
    });
  });

  // Function to clean empty children and sort children alphabetically by asset
  const cleanHierarchyAssets = (assets: HierarchyAsset[]) => {
    assets.forEach((asset) => {
      if (asset.children?.length === 0) {
        delete asset.children;
      } else if (asset.children?.length) {
        cleanHierarchyAssets(asset.children);
      }
    });

    assets.sort((a, b) => a.asset.localeCompare(b.asset));
  };

  // Clean and sort the hierarchy assets
  cleanHierarchyAssets(hierarchyAssets);

  return hierarchyAssets;
}
