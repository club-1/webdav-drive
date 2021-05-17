export interface Listable {
	/**
	 * List all the properties of this object.
	 * @returns a map of string properties.
	 */
	list(): Map<string, string>;
}
