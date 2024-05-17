import { createSingularProperty } from '../../app/api-factory';
import { log } from '../../external-services';
import { Properties, ArrayProperty, AbstractProperty, Step} from '../api';

const removeStartingDash = (str: string): string =>
  str[0] == '-' ? str.substring(1) : str;

// function areAllItemsTheSame(array: any[]) {
//     return new Set(array).size == 1
// }
export async function extractStepFromText({
  schemaText
  , exampleText: exampleText
}: { schemaText: string, exampleText: string }): Promise<Step> {

  let title = schemaText.trim().split('\n')[0];
  if (!title) {
    return Promise.reject('Unknown text format.');
  }
  let result: Step = {
    title: title,
    schema: {
      type: 'object',
      properties: <Properties>{},
    },
    example: {}
  };
  const rows = exampleText.trim().split(/\n|;|,|\//);
  if (rows[0] == title) {
    rows.shift();
  }

  // title = snakeCase(title!).trim()

  // var props: Properties = {}
  //
  let isInArrayScope = false; //Pass it as a recursive parameter
  let parentArrayPropertyName = '';//Pass it as a recursive parameter
  //^Refactor to a stack

  rows.map(row => row.split(':'))
    .forEach(kv => {

      let propertyName = removeStartingDash(kv[0].trim())?.trim();
      if (propertyName == '')
        return;

      let propertyValue = kv[1]?.trim();
      if (!propertyValue) {
        propertyValue = propertyName;
      }

      if (isInArrayScope) {
        if (propertyValue.endsWith(']')) {
          propertyValue = propertyValue.slice(0, -1);
          isInArrayScope = false;
          propertyName = propertyName.slice(0, -1);
        }
        // result.data[propertyName] = propertyValue;
        if (!Array.isArray(result.example![parentArrayPropertyName]!))
                    result.example![parentArrayPropertyName] = [];
                result.example![parentArrayPropertyName].push(propertyValue);

                const s = createSingularProperty(propertyName, propertyValue);


                let items = (<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items;

                if (!items) (<AbstractProperty>items) = s;
                else if (Array.isArray(items)) (<AbstractProperty[]>items).push(s);
                else if (items != s) items = [items, s];

                (<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items = items;
                log.log(propertyName + ' The property: ' + parentArrayPropertyName + ' schema set to: '
                    + propertyValue + '=> result:', (<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items);


                log.log('The property: ' + parentArrayPropertyName + ' data set to: ' + propertyValue + '=> result:', result.example![parentArrayPropertyName]);
                return;
      }


      if (propertyValue[0].startsWith('[')) {
        isInArrayScope = true;
        const property: ArrayProperty = {
          type: 'array',
          description: propertyName,
          items: [],
        };
        const firstItemsPropertyName = propertyValue.substring(1);

        const s = createSingularProperty(firstItemsPropertyName, firstItemsPropertyName);
        // property.items = s;

        result.schema.properties[propertyName] = property;
                result.example![propertyName] = {};
                result.example![propertyName][firstItemsPropertyName] = [s.example];
                parentArrayPropertyName = propertyName;
                return;
      }

            result.example![propertyName] = propertyValue;
            const s = createSingularProperty(propertyName, propertyValue);
            result.schema.properties[propertyName] = s;
    });
  return Promise.resolve(result);
}