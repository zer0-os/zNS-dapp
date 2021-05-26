import {
	Column,
	ensurePluginOrder,
	Hooks,
	TableInstance,
	useGlobalFilter,
} from 'react-table';

const pluginName = 'useSafeGlobalFilter';

export function useSafeGlobalFilter<D extends object>(hooks: Hooks<D>) {
	hooks.column.push(columns);
	hooks.useInstance.push(useInstance);
	useGlobalFilter(hooks);
}

useSafeGlobalFilter.pluginName = pluginName;

function columns<D extends object>(columns: Column<D>[]) {
	return [...columns.map((column) => ({ Filter: column }))];
}

function useInstance<D extends object>(instance: TableInstance<D>) {
	const { plugins } = instance;
	try {
		ensurePluginOrder(plugins, ['useGlobalFilter'], pluginName);
	} catch (e) {
		throw new Error(`error`);
	}
}
