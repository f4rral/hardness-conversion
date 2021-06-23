import valuesHardness from 'json/hardness-values.json';

// иницализация
let formConverter = document.querySelector('#formConverter');

let status = {
  inputKey: 'hra', // hra
  outputKey: 'vickers', // vickers
  inputValue: null,
  outputValue: null,
};

status.maxInput = Math.max.apply(null, valuesHardness.map(element => element[status.inputKey]));
status.minInput = Math.min.apply(null, valuesHardness.map(element => element[status.inputKey]));

// обработка изменения в форме
formConverter.oninput = function(event) {
  let target = event.target;

  target.value = target.value
    .replace(/[^0-9\.,]/g, '')
    .replace(/([\.|,].*)[\.|,]/g, '$1'); // можно разделить на .replace(/(\..*)\./g, '$1') и .replace(/(,.*),/g, '$1')

  status[target.name] = getStatus(target);
  controller(status);

  console.log(status);
};

// контроллер
function controller(status) {
  console.log('run controller');

  status.outputValue = searchHardness(status);

  if (!status.inputValue) {
    displayStatus('');
    return;
  }

  if (status.inputValue > status.maxInput) {
    displayStatus('значение велико', true);
    return;
  }

  if (status.inputValue < status.minInput) {
    displayStatus('значение мало', true);
    return;
  }

  if (status.outputValue.length == 0) {
    displayStatus('значений не найдено', true);
    return;
  }
  
  if (status.outputValue.length > 0) {
    displayStatus(status.outputValue
      .map(element => element[status.outputKey])
      .join('; '));
    return;
  }
}

// получение значения
function getStatus(element) {
  return Math.round(parseFloat(element.value)) || null;
}

// отображение состояния
function displayStatus(message, err) {
  let outputView = formConverter.outputValue;

  if (!err) {
    outputView.classList.remove('input__value--error');
  } else {
    outputView.classList.add('input__value--error');
  }

  outputView.value = message;
}

// поиск соответствий
function searchHardness(criteria) {
  let {
    inputKey, 
    inputValue, 
    outputKey, 
    maxInput, 
    minInput
  } = criteria;

  let accumulator = [];
  let minDiff = Infinity;

  if (inputValue > maxInput || inputValue < minInput) {
    console.log('Выход за допустимые значения');
    return [];
  }

  valuesHardness.sort((a, b) => a[inputKey] - b[inputKey]);

  for (let i = 0; i < valuesHardness.length - 1; i++) {
    if (Math.abs(valuesHardness[i][inputKey] - inputValue) === minDiff) {
      accumulator.push(valuesHardness[i]);
    }

    if (Math.abs(valuesHardness[i][inputKey] - inputValue) < minDiff) {
      minDiff = Math.abs(valuesHardness[i][inputKey] - inputValue);
      accumulator = [];
      accumulator.push(valuesHardness[i]);
    }
  }

  console.log(accumulator);
  return accumulator.sort((a, b) => a[outputKey] - b[outputKey]);
}