import * as _ from 'lodash';
import { AsyncOrSync } from 'ts-essentials';

type FieldValidator<Values> = {
	[name in keyof Values]: (
		value: Values[name],
	) => AsyncOrSync<string | undefined>;
};

type FormErrors<Values> = {
	[name in keyof Values]: string | undefined;
};

type FormValidator<Values extends Record<string, any>> = (
	values: Values,
	errors: FormErrors<Values>,
) => FormErrors<Values>;

export const composeValidator = <Values extends Record<string, any>>(
	fieldValidators: FieldValidator<Values>,
	// the default form validator just returns field-level validations
	formValidator: FormValidator<Values> = (
		values: Values,
		errors: FormErrors<Values>,
	) => errors,
): ((
	values: Record<string, any>,
) => AsyncOrSync<FormErrors<Record<string, any>>>) => {
	const names: (keyof Values)[] = _.keys(fieldValidators) as any;

	const fieldLevelValidators = names.map(
		(name) => (value: Values[typeof name]) => fieldValidators[name](value),
	);

	// async reduce errors per-field into an errors object
	const fieldLevelValidator = (
		values: Values,
	): AsyncOrSync<FormErrors<Values>> => {
		const errorsOrPromises = names.map((name, i) =>
			fieldLevelValidators[i](values[name]),
		);

		const reduce = (errors: (string | undefined)[]): FormErrors<Values> =>
			names.reduce(
				(memo: FormErrors<Values>, name, i) => ({
					...memo,
					[name]: errors[i],
				}),
				{} as any,
			);

		if (
			_.some(
				errorsOrPromises,
				(val: any) =>
					typeof val === 'object' && val.then && typeof val.then === 'function',
			)
		) {
			// if any of these results are a promise, await them all then reduce
			return Promise.all(errorsOrPromises).then(reduce);
		}

		// otherwise return immediately
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return reduce(<any>errorsOrPromises);
	};

	// the final-form `validate` function
	// NOTE: if we return a Promise to final-form it will toggle the `validating`
	// state, which is expected. If our promise resolves immediately, however,
	// that means our `validating` state flickers the UI and it looks pretty bad.
	// The solution is to conditionally return a promise only when necessary.
	return (values: Record<string, any>) => {
		// ask for field-level errors
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const errorsOrPromise = fieldLevelValidator(<any>values);

		// pass the current values and their validity to the form-level validator
		// that can implement conditional logic and more complex validations
		const runFormValidator = (errors: FormErrors<Values>) =>
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			formValidator(<any>values, errors);

		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		if (errorsOrPromise && (<any>errorsOrPromise).then) {
			// if promise, promise
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			return (<Promise<FormErrors<Values>>>errorsOrPromise).then(
				runFormValidator,
			);
		}

		// otherwise, it's an errors object
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return runFormValidator(<FormErrors<Values>>errorsOrPromise);
	};
};
