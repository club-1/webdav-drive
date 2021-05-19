export interface Listable {
	/**
	 * List all the properties of this object.
	 * @returns a map of properties.
	 */
	list(): Map<string, any>;
}
