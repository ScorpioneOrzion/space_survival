export default (key: string, value: unknown) => { if (typeof value === 'bigint') { return value.toString() + 'n'; } return value; };
