/* eslint-disable no-undef */
import { extractStepFromText } from '../../app/scenario-builder/board-text-schema-extractor';
import { CSSProperties } from 'react';
import { IBoard, ModalOptions, ModalResult, SelectedStep, WidgetSnapshot } from '../../app/ports/iboard';
import { log } from '../../external-services';
import type { Item, OpenModalOptions } from '@mirohq/websdk-types';
const ON_SELECTION = 'selection:update';
export class MiroBoard implements IBoard {
  getModalParameters<T>(): Promise<T | undefined> {
    return miro.board.ui.getModalData<T>();
  }

  openModal<Data, Result>(options: ModalOptions<Data>): Promise<ModalResult<Result>> {
    return miro.board.ui.openModal<Data, Result>(<OpenModalOptions<Data>>{ fullscreen: true, data: options.parameters, url: options.url });
  }
  closeModal() { return miro.board.ui.closeModal(); }

  private previousHandler: (_selections: Item[]) => Promise<void>;
  onNextOneSelection(succeed: (_selected: SelectedStep) => void) {
    const handle = async (selected) => {
      var widgets = selected.items as Item[];

      if (widgets.length == 0) return;

      if (widgets.length > 1) {
        log.log(`${widgets.length} items are selected. Only a single one can be selected.`);
        return;
      }

      try {
        await miro.board.events.off(ON_SELECTION, handle);
        const selectedStep = await extractStepFrom(widgets[0]);
        succeed(selectedStep);
      }
      catch (e) { log.log(e); }
    };

    if (this.previousHandler) miro.board.ui.off(ON_SELECTION, this.previousHandler);
    this.previousHandler = handle;

    return miro.board.ui.on(ON_SELECTION, handle);
  }

  unselectAll = async () => {


    await miro.board.deselect();
  };

  showNotification = (message: string) =>
    miro.board.notifications.showInfo(message);

  zoomTo = async (widget: WidgetSnapshot) =>
    miro.board.viewport.zoomTo(await miro.board.get({ id: widget.id }));


  // private constructor() { }

  // static async create() {
  //     if (!miro?.board) MiroBoard.waitFor(200)
  //     return new MiroBoard()
  // }

  // private static async waitFor(milliseconds:number) {
  //     await new Promise(resolve => setTimeout(resolve, milliseconds))
  // }

}


function getWidgetStyle(widget: Item) {
  const style = {} as CSSProperties;

  if (('style' in widget || 'fillColor' in widget['style']) == false)
    return style;

  style.backgroundColor = mapColor(widget['style']['fillColor']);

  if (widget['style']['fillColor'] == 'back')
    style.color = mapColor('gray');

  return style;
}

const mapColor = (fillColor: string): string =>
  ({
    'gray': 'rgb(245, 246, 248)',
    'light_yellow': 'rgb(255, 249, 177)',
    'yellow': 'rgb(245, 209, 40)',
    'orange': 'rgb(255, 157, 72)',

    'light_green': 'rgb(213, 246, 146)',
    'green': 'rgb(201, 223, 86)',
    'dark_green': 'rgb(147, 210, 117)',
    'cyan': 'rgb(103, 198, 192)',

    'light_pink': 'rgb(255, 206, 224)',
    'pink': 'rgb(234, 148, 187)',
    'violet': 'rgb(198, 162, 210)',
    'red': 'rgb(240, 147, 157)',

    'light_blue': 'rgb(166, 204, 245)',
    'blue': 'rgb(108, 216, 250)',
    'dark_blue': 'rgb(158, 169, 255)',
    'black': 'rgb(0, 0, 0)',
  }[fillColor] ?? fillColor);


const getPlainText = (originalText: string): string =>
  originalText.split('</p><p>').join('\n')
    .replace('&#43;', '+')
    .replace(/(<([^>]+)>)/ig, '');


async function extractStepFrom(widget: Item): Promise<SelectedStep> {

  try {
    let text = getPlainText(await extractWidgetText(widget));

    const step: SelectedStep = {
      widgetSnapshot: {
        id: widget.id,
        style: getWidgetStyle(widget)
      }
      , step: await extractStepFromText({
        schemaText: text,
        exampleText: text
      })
    };
    return step;
  }
  catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
}
function extractWidgetText(widget: Item): Promise<string> {

  if (!widget)
    return Promise.reject('Cannot get the widget text. The widget is undefined.');

  if ('content' in widget)
    return Promise.resolve(widget.content as string);
  if('title' in widget)
    return Promise.resolve(widget.title as string);

  return Promise.reject(`The widget ${JSON.stringify(widget)} does not have any text`);
}