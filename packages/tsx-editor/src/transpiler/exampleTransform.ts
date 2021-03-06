import { getWindow } from 'office-ui-fabric-react/lib/Utilities';
import { tryParseExample, IMPORT_REGEX } from './exampleParser';
import { _supportedPackageToGlobalMap } from './transpileHelpers';
import { IBasicPackageGroup, ITransformedCode } from '../interfaces/index';
// Don't reference anything importing Monaco in this file to avoid pulling Monaco into the
// main bundle or breaking tests!

export interface ITransformExampleParams {
  /**
   * TS for the example. Will be used to find imports/exports. Will also be used in the final
   * returned code if `jsCode` is not provided.
   */
  tsCode: string;

  /**
   * The example transpiled into JS, output module format ES2015 or ESNext.
   * Will be used in the final returned code if provided.
   */
  jsCode?: string;

  /**
   * If true, the code will be transformed into an immediately invoked function expression which
   * returns the component (rather than including a `ReactDOM.render(...)` line). If false, the code
   * will not be wrapped in a function and will actually render the component.
   */
  returnComponent?: boolean;

  /** ID for the component to be rendered into (required unless `returnComponent` is true) */
  id?: string;

  /** Supported package groups (React is implicitly supported) */
  supportedPackages: IBasicPackageGroup[];
}

const win = getWindow() as
  | Window & {
      transformLogging?: boolean;
    }
  | undefined;

/**
 * Transform an example for rendering in a browser context (example page or codepen).
 */
export function transformExample(params: ITransformExampleParams): ITransformedCode {
  const { tsCode, jsCode, id = 'content', supportedPackages, returnComponent } = params;

  // Imports or exports will be removed since they are not supported.
  const code = (jsCode || tsCode)
    // Use .source because IE 11 doesn't support creating a regex from a regex
    .replace(new RegExp(IMPORT_REGEX.source, 'gm'), '')
    .replace(/^export /gm, '')
    .trim();

  const output: ITransformedCode = {};

  // Get info about the example's imports and exports
  const exampleInfo = tryParseExample(tsCode, supportedPackages);
  if (typeof exampleInfo === 'string') {
    // this means it's an error
    output.error = exampleInfo;
    return output;
  }

  const { component, imports } = exampleInfo;

  // Make a list of all the identifiers imported from each global, including converting renamed
  // identifiers ("foo as bar") to be renamed destructuring-style ("foo: bar")
  const supportedPackagesToGlobals = _supportedPackageToGlobalMap(supportedPackages);
  const identifiersByGlobal: { [globalName: string]: string[] } = {};
  for (const imprt of imports) {
    if (imprt.packageName === 'react') {
      continue; // React is globally available and other imports from it aren't supported
    }
    const globalName = supportedPackagesToGlobals[imprt.packageName];
    identifiersByGlobal[globalName] = identifiersByGlobal[globalName] || [];
    identifiersByGlobal[globalName].push(...imprt.identifiers.map(item => (item.as ? `${item.name}: ${item.as}` : item.name)));
  }

  let lines = [code];

  // Generate Fabric wrapper stuff for the component if appropriate
  let finalComponent = component;
  if (identifiersByGlobal.Fabric) {
    // If this is a Fabric example, wrap in a <Fabric> (and add an import for that if needed),
    // and initialize icons in case the example uses them.
    finalComponent = component + 'Wrapper';

    // If immediately running the code, the component can't use JSX format
    const wrapperCode = returnComponent
      ? `React.createElement(Fabric, null, React.createElement(${component}, null))`
      : `<Fabric><${component} /></Fabric>`;
    lines.push('', `const ${finalComponent} = () => ${wrapperCode};`);

    if (identifiersByGlobal.Fabric.indexOf('Fabric') === -1) {
      identifiersByGlobal.Fabric.push('Fabric');
    }

    if (identifiersByGlobal.Fabric.indexOf('initializeIcons') === -1) {
      lines.unshift('// Initialize icons in case this example uses them', 'initializeIcons();', '');
      identifiersByGlobal.Fabric.push('initializeIcons');
    }
  }

  // Add const destructuring for formerly-imported identifiers
  lines.unshift('');
  lines = Object.keys(identifiersByGlobal)
    .map(globalName => `const { ${identifiersByGlobal[globalName].join(', ')} } = window.${globalName};`)
    .concat(lines);

  if (returnComponent) {
    // Wrap in IIFE
    lines.unshift('(function() {');
    lines.push(`return ${finalComponent};`);
    lines.push('})()');
  } else {
    // Add render line
    lines.push(`ReactDOM.render(<${finalComponent} />, document.getElementById('${id}'))`);
  }

  output.output = lines.join('\n');

  if (win && win.transformLogging) {
    console.log('TRANSFORMED:');
    console.log(output.output);
  }
  return output;
}
