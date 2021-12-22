let arrayCurrency = ['USD', 'RUB', 'UAH'];

function createAllElements() {
    let divContainer = document.createElement('DIV') as HTMLDivElement;
    divContainer.className = 'container';
    divContainer.setAttribute('id', 'container');
    let body = document.querySelector('body');
    if(body){
        body.appendChild(divContainer);
    }
    let divClientsList = document.createElement('DIV') as HTMLDivElement;
    divClientsList.setAttribute('id', 'divClientsList');
    divClientsList.className = 'list';
    divContainer.appendChild(divClientsList);
    let h2 = document.createElement('H2') as HTMLHeadingElement;
    h2.className = 'headingH2';
    h2.innerHTML = 'Пользователи';
    divClientsList.appendChild(h2);
}
createAllElements();

function showFormAddEmployee() {
    let divWorkSpace = document.createElement('DIV') as HTMLDivElement;
    divWorkSpace.className = 'workSpace';
    divWorkSpace.setAttribute('id', 'workSpace');
    let divContainer = document.getElementById('container');
    if(divContainer){
        divContainer.appendChild(divWorkSpace);
    }

    let h2WorkSpace = document.createElement('H2') as HTMLHeadingElement;
    h2WorkSpace.className = 'headingH2';
    h2WorkSpace.innerHTML = 'Рабочая область';
    divWorkSpace.appendChild(h2WorkSpace);
    let chooseAction = document.createElement('SELECT') as HTMLSelectElement;
    chooseAction.setAttribute('id', 'chooseAction');
    chooseAction.className = 'select';
    divWorkSpace.appendChild(chooseAction);
    let optionSelectAction = document.createElement('OPTION') as HTMLOptionElement;
    optionSelectAction.innerHTML = 'Выберите действие';
    optionSelectAction.setAttribute('id', 'chooseAction');
    chooseAction.appendChild(optionSelectAction);
    let optionCreateNewCustomer = document.createElement('OPTION') as HTMLOptionElement;
    optionCreateNewCustomer.setAttribute('data-action', "addClient");
    optionCreateNewCustomer.innerHTML = 'Добавить нового клиента';
    optionCreateNewCustomer.setAttribute('id', 'createCustomer');
    chooseAction.appendChild(optionCreateNewCustomer);
}
showFormAddEmployee();

interface ClientInfo {
    name?: string;
    surname?: string;
    id?: number;
    is_active?: boolean;
    bills?: Bill[];
}

interface Data {
    ccy: string,
    base_ccy: string,
    buy: string,
    sale: string
}

interface ClientAccount {
    type?: string;
    currency?: string;
    amount?: number;
    limit?: number;

}
class Bill{
    type!: string;
    amount!: number;
    currency!: string;
    limit!: number;
    constructor(){
    }
    set typeBill(value: string){
        this.type = value;
    }
    set amountBill(value: number){
        this.amount = value;
    }
    set currencyBill(value: string){
        this.currency = value;
    }
}

class Bank {
    id: number;
    select!: HTMLSelectElement;
    [action: string]: any;
    [action: number]: Function;
    clients: ClientInfo[];
    contextBank: this;
    constructor() {
        this.clients = [];
        this.id = 0;
        this.select = (document.querySelector('.select')) as HTMLSelectElement;
        this.select.addEventListener('change', this.onEvent.bind(this));
        this.contextBank = this;
    }
    onEvent(event: Event) {
        let element = event.target as HTMLSelectElement
        let action = element.children[element.selectedIndex].getAttribute("data-action");
        if (action !== null) {
            this[action]();
        }
    }

    getThis(){
        return this;
    }

    addClients(clientInfo: ClientInfo) {
        clientInfo.id = ++this.id;
        clientInfo.is_active = true;
        clientInfo.bills = [];
        this.clients.push(clientInfo);
    }
    addBills(clientId: number, bill: Bill) {
        for (let client of this.clients) {
            if (client.id == clientId) {
                if (client.bills) {
                    client.bills.push(bill);
                }
            }
        }
    }
    addClient() {
        let currentContext = this.getThis();
        let clientInfo: ClientInfo = {};
        let inputName = document.createElement('INPUT') as HTMLInputElement;
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        inputName.setAttribute('placeholder', 'Имя клиента*');
        inputName.className = 'input';
        formAdd.appendChild(inputName);
        let inputSurname = document.createElement('INPUT') as HTMLInputElement;
        inputSurname.setAttribute('placeholder', 'Фамилия клиента*');
        inputSurname.className = 'input';
        formAdd.appendChild(inputSurname);
        let button = document.createElement('DIV') as HTMLDivElement;
        button.className = 'button';
        button.innerHTML = 'Добавить';
        formAdd.appendChild(button);
        button.addEventListener('click', function () {
            let inputs = document.querySelectorAll('.input');
            inputs.forEach(function (input) {
                if ((input as HTMLInputElement).value === "") {
                    alert('Введите ' + (input as HTMLInputElement).placeholder);
                } else if (!(input as HTMLInputElement).value.match(/[A-zА-яЁё]/)) {
                    alert((input as HTMLInputElement).placeholder + ' должен содержать только буквы')
                }
            });
            clientInfo.name = inputName.value;
            clientInfo.surname = inputSurname.value;
            currentContext.addClients(clientInfo);
            let divInfoClient = document.createElement('DIV') as HTMLDivElement;
            divInfoClient.className = 'cards';
            divInfoClient.setAttribute('id', 'divInfoClient' + clientInfo.id);
            let divClientsList = document.getElementById('divClientsList');
            if (divClientsList) {
                divClientsList.appendChild(divInfoClient);
                divClientsList.setAttribute('id', 'divClientsList');
            }
            let cardClient = document.createElement('DIV') as HTMLDivElement;
            cardClient.className = 'clientStyle';
            divInfoClient.appendChild(cardClient);
            let id = document.createElement('P') as HTMLParagraphElement;
            id.innerHTML = 'ID: ' + clientInfo.id;
            cardClient.appendChild(id);
            let name = document.createElement('P') as HTMLParagraphElement;
            name.setAttribute('id', 'name' + clientInfo.id)
            name.innerHTML = 'Имя: ' + inputName.value;
            cardClient.appendChild(name);
            let surname = document.createElement('P') as HTMLParagraphElement;
            surname.setAttribute('id', 'surname' + clientInfo.id);
            surname.innerHTML = 'Фамилия: ' + inputSurname.value;
            cardClient.appendChild(surname);
            inputName.remove();
            inputSurname.remove();
            button.remove();
            let chooseAction = document.getElementById('chooseAction') as HTMLSelectElement;
            chooseAction.value = 'Выберите действие';
            let editClient = document.getElementById('edit');
            if (editClient === null) {
                editClient = document.createElement('OPTION');
                editClient.innerHTML = 'Редактировать клиента';
                editClient.setAttribute('data-action', 'editClient');
                editClient.setAttribute('id', 'edit');
            }
            let changeActivity = document.getElementById('change');
            if (changeActivity === null) {
                changeActivity = document.createElement('OPTION');
                changeActivity.innerHTML = 'Изменить активность клиента';
                changeActivity.setAttribute('data-action', 'addStatusActivity');
                changeActivity.setAttribute('id', 'change');
            }
            let addAccounts = document.getElementById('accounts');
            if (addAccounts === null) {
                addAccounts = document.createElement('OPTION');
                addAccounts.innerHTML = 'Открыть счет клиенту';
                addAccounts.setAttribute('data-action', 'addAccount');
                addAccounts.setAttribute('id', 'accounts');
            }
            let allSumMoney = document.getElementById('sumMoney');
            if (allSumMoney === null) {
                allSumMoney = document.createElement('OPTION');
                allSumMoney.innerHTML = 'Все средства в банке';
                allSumMoney.setAttribute('id', 'sumMoney');
                allSumMoney.setAttribute('data-action', 'getAllSumMoney');
            }
            let debtAmount = document.getElementById('debtAmount');
            if (debtAmount === null) {
                debtAmount = document.createElement('OPTION');
                debtAmount.innerHTML = 'Сумма долга банку';
                debtAmount.setAttribute('id', 'debtAmount');
                debtAmount.setAttribute('data-action', 'getAmountDebt');
            }
            let amountDebtClients = document.getElementById('amountDebtClients');
            if (amountDebtClients === null) {
                amountDebtClients = document.createElement('OPTION');
                amountDebtClients.innerHTML = 'Количество должников';
                amountDebtClients.setAttribute('id', 'amountDebtClients');
                amountDebtClients.setAttribute('data-action', 'getAmountDebtClients');
            }
            let sumDebtClients = document.getElementById('sumDebtClients');
            if (sumDebtClients === null) {
                sumDebtClients = document.createElement('OPTION');
                sumDebtClients.innerHTML = 'Сумма долга по активности';
                sumDebtClients.setAttribute('id', 'sumDebtClients');
                sumDebtClients.setAttribute('data-action', 'getSumDebtClientsByActivity');
            }
            if (chooseAction) {
                chooseAction.appendChild(editClient);
                chooseAction.appendChild(changeActivity);
                chooseAction.appendChild(addAccounts);
                chooseAction.appendChild(allSumMoney);
                chooseAction.appendChild(debtAmount);
                chooseAction.appendChild(amountDebtClients);
                chooseAction.appendChild(sumDebtClients);
            }
        });
        return clientInfo;
    }
    editClient() {
        let currentContext = this.getThis();
        let cont = this.getThis();
        let chooseID = document.createElement('SELECT') as HTMLSelectElement;
        chooseID.className = 'select';
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        formAdd.appendChild(chooseID);
        let doChoose = document.createElement('OPTION') as HTMLOptionElement;
        doChoose.innerHTML = 'Выберите ID';
        chooseID.appendChild(doChoose);
        for (let item of cont.clients) {
            let cutomerID = document.createElement('OPTION') as HTMLOptionElement;
            if (item.id) {
                cutomerID.innerHTML = String(item.id);
            }
            chooseID.appendChild(cutomerID);
        }
        chooseID.addEventListener('change', function () {
            let id = chooseID.value;
            let name = document.getElementById('name' + id);
            let surname = document.getElementById('surname' + id);
            let inputName = document.createElement('INPUT') as HTMLInputElement;
            let divWorkSpace = document.getElementById('workSpace');
            let formAdd = document.createElement('FORM') as HTMLFormElement;
            if (divWorkSpace) {
                divWorkSpace.appendChild(formAdd);
            }
            inputName.setAttribute('placeholder', 'Имя клиента*');
            inputName.className = 'input';
            inputName.value = '';
            if (name) {
                inputName.value = name.innerHTML;
            }
            formAdd.appendChild(inputName);
            let inputSurname = document.createElement('INPUT') as HTMLInputElement;
            inputSurname.setAttribute('placeholder', 'Фамилия клиента*');
            inputSurname.className = 'input';
            inputSurname.value = '';
            if (surname) {
                inputSurname.value = surname.innerHTML;
            }
            formAdd.appendChild(inputSurname);
            let button = document.createElement('DIV') as HTMLDivElement;
            button.className = 'button';
            button.innerHTML = 'Подтвердить';
            formAdd.appendChild(button);
            let inputs = document.querySelectorAll('.input');
            inputs.forEach(function (input) {
                (input as HTMLInputElement).addEventListener('click', function (event) {
                    (input as HTMLInputElement).value = '';
                });
            });
            button.addEventListener('click', function () {
                inputs.forEach(function (input) {
                    if ((input as HTMLInputElement).value === "") {
                        alert('Введите ' + (input as HTMLInputElement).placeholder);
                    } else if (!(input as HTMLInputElement).value.match(/[A-zА-яЁё]/)) {
                        alert((input as HTMLInputElement).placeholder + ' должен содержать только буквы')
                    }
                });
                if (name) {
                    name.innerHTML = 'Имя: ' + inputName.value;
                }
                if (surname) {
                    surname.innerHTML = 'Фамилия: ' + inputSurname.value;
                }
                for (let item of currentContext.clients) {
                    item.name = inputName.value;
                    item.surname = inputSurname.value;
                }
                chooseID.remove();
                inputName.remove();
                inputSurname.remove();
                button.remove();
                let chooseAction = document.getElementById('chooseAction');
                if (chooseAction) {
                    (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                }
            });
        });
    }
    addStatusActivity() {
        let currentContext = this.getThis();
        let chooseID = document.createElement('SELECT') as HTMLSelectElement;
        chooseID.className = 'select';
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        formAdd.appendChild(chooseID);
        let doChoose = document.createElement('OPTION') as HTMLOptionElement;
        doChoose.innerHTML = 'Выберите ID';
        chooseID.appendChild(doChoose);
        for (let item of currentContext.clients) {
            let cutomerID = document.createElement('OPTION') as HTMLOptionElement;
            cutomerID.innerHTML = String(item.id);
            chooseID.appendChild(cutomerID);
        }
        chooseID.addEventListener('change', function () {
            let id = chooseID.value;
            let divWorkSpace = document.getElementById('workSpace');
            let formAdd = document.createElement('FORM') as HTMLFormElement;
            if (divWorkSpace) {
                divWorkSpace.appendChild(formAdd);
            }
            for (let item of currentContext.clients) {
                if (String(item.id) == id) {
                    let labelActive = document.createElement('LABEL') as HTMLLabelElement;
                    formAdd.appendChild(labelActive);
                    let inputActive = document.createElement('INPUT') as HTMLInputElement;
                    inputActive.setAttribute('name', 'activity');
                    inputActive.setAttribute('type', 'radio');
                    inputActive.setAttribute('value', 'true');
                    inputActive.className = 'checkbox';
                    labelActive.innerHTML = 'Активный';
                    labelActive.appendChild(inputActive);
                    let labelInactive = document.createElement('LABEL') as HTMLLabelElement;
                    formAdd.appendChild(labelInactive);
                    let inputInactive = document.createElement('INPUT') as HTMLInputElement;
                    inputInactive.setAttribute('name', 'activity');
                    inputInactive.setAttribute('value', 'false');
                    inputInactive.setAttribute('type', 'radio');
                    inputInactive.className = 'checkbox';
                    labelInactive.innerHTML = 'Не активный';
                    labelInactive.appendChild(inputInactive);
                    if (item.is_active) {
                        inputActive.setAttribute('checked', 'checked');
                    } else if (!item.is_active) {
                        inputInactive.setAttribute('checked', 'checked');
                    }
                    let button = document.createElement('DIV');
                    button.innerHTML = 'Подтвердить'
                    button.className = 'button';
                    formAdd.appendChild(button);
                    button.addEventListener('click', function () {
                        if (inputActive.checked) {
                            item.is_active = true;
                        } else if (inputInactive.checked) {
                            item.is_active = false;
                        }
                        formAdd.remove();
                        chooseID.remove();
                        button.remove();
                        let chooseAction = document.getElementById('chooseAction');
                        if (chooseAction) {
                            (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                        }
                    });
                }
            }
        });
    }
    addAccount() {
        let currentContext = this.getThis();
        let chooseID = document.createElement('SELECT') as HTMLSelectElement;
        chooseID.className = 'select';
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        formAdd.appendChild(chooseID);
        let doChoose = document.createElement('OPTION') as HTMLOptionElement;
        doChoose.innerHTML = 'Выберите ID';
        chooseID.appendChild(doChoose);
        for (let item of currentContext.clients) {
            let cutomerID = document.createElement('OPTION') as HTMLOptionElement;
            cutomerID.innerHTML = String(item.id);
            chooseID.appendChild(cutomerID);
        }
        chooseID.addEventListener('change', function () {
            let id = (chooseID as HTMLSelectElement).value;
            let divWorkSpace = document.getElementById('workSpace');
            let formAdd = document.createElement('FORM') as HTMLFormElement;
            if (divWorkSpace) {
                divWorkSpace.appendChild(formAdd);
            }
            let currensyBill = document.createElement('SELECT') as HTMLSelectElement;
            formAdd.appendChild(currensyBill);
            let currencyChoose = document.createElement('OPTION') as HTMLOptionElement;
            currencyChoose.innerText = 'Выберите валюту';
            currensyBill.appendChild(currencyChoose);
            for (let item of arrayCurrency) {
                let currensy = document.createElement('OPTION') as HTMLOptionElement;
                currensy.setAttribute('value', item);
                currensy.innerHTML = item;
                currensyBill.appendChild(currensy);
            }
            let selectTypeBill = document.createElement('SELECT') as HTMLSelectElement;
            formAdd.appendChild(selectTypeBill);
            let chooseTypeBill = document.createElement('OPTION') as HTMLOptionElement;
            chooseTypeBill.innerHTML = 'Выберите тип счета';
            selectTypeBill.appendChild(chooseTypeBill);
            let credit = document.createElement('OPTION') as HTMLOptionElement;
            credit.innerHTML = 'Кредитный';
            credit.setAttribute('value', 'credit');
            selectTypeBill.appendChild(credit);
            let debet = document.createElement('OPTION') as HTMLOptionElement;
            debet.innerHTML = 'Дебетовый';
            debet.setAttribute('value', 'debet');
            selectTypeBill.appendChild(debet);
            selectTypeBill.addEventListener('change', function () {
                let inputAmount = document.createElement('INPUT') as HTMLInputElement;
                formAdd.appendChild(inputAmount);
                inputAmount.setAttribute('placeholder', 'Введите сумму');
                inputAmount.className = 'input';
                let inputLimit = document.createElement('INPUT') as HTMLInputElement;
                if (selectTypeBill.value === 'credit') {
                    formAdd.appendChild(inputLimit);
                    inputLimit.setAttribute('placeholder', 'Введите лимит');
                    inputLimit.className = 'input';
                }
                let button = document.createElement('DIV') as HTMLDivElement;
                button.className = 'button';
                button.innerHTML = 'Подтвердить';
                formAdd.appendChild(button);
                button.addEventListener('click', function () {
                    let bill = new Bill();
                    bill.type = selectTypeBill.value;
                    bill.currency = currensyBill.value;
                    bill.amount = Number(inputAmount.value);
                    if (selectTypeBill.value === 'credit') {
                        bill.limit = Number(inputLimit.value);
                    }
                    currentContext.addBills(Number(id), bill);
                    let divInfoClient = document.getElementById('divInfoClient' + id);
                    let cardBill = document.createElement('DIV') as HTMLDivElement;
                    cardBill.className = 'clientStyle';
                    if (divInfoClient) {
                        divInfoClient.appendChild(cardBill);
                    }
                    let pType = document.createElement('P') as HTMLParagraphElement;
                    pType.innerHTML = 'Тип счета: ' + selectTypeBill.value;
                    cardBill.appendChild(pType);
                    let pCurrensy = document.createElement('P') as HTMLParagraphElement;
                    pCurrensy.innerHTML = 'Валюта: ' + currensyBill.value;
                    cardBill.appendChild(pCurrensy);
                    let pAmount = document.createElement('P') as HTMLParagraphElement;
                    pAmount.innerHTML = 'Сумма: ' + inputAmount.value;
                    cardBill.appendChild(pAmount);
                    if (selectTypeBill.value === 'credit') {
                        let pLimit = document.createElement('P') as HTMLParagraphElement;
                        pLimit.innerHTML = 'Лимит' + inputLimit.value;
                    }
                    formAdd.remove();
                    chooseID.remove();
                    currensyBill.remove();
                    selectTypeBill.remove();
                    inputAmount.remove();
                    inputLimit.remove();
                    button.remove();
                    let chooseAction = document.getElementById('chooseAction');
                    if (chooseAction) {
                        (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                    }
                });
            });
        });
    }
    getAllSumMoney() {
        let currentContext = this.getThis();
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        let currensyCount = document.createElement('SELECT') as HTMLSelectElement;
        formAdd.appendChild(currensyCount);
        currensyCount.className = 'select';
        currensyCount.setAttribute('id', 'currensyCounter');
        let currencyChoose = document.createElement('OPTION') as HTMLOptionElement;
        currencyChoose.innerText = 'Выберите валюту для рассчета';
        currensyCount.appendChild(currencyChoose);
        for (let item of arrayCurrency) {
            let currensyToCount = document.createElement('OPTION') as HTMLOptionElement;
            currensyToCount.setAttribute('value', item);
            currensyToCount.innerHTML = item;
            currensyCount.appendChild(currensyToCount);
        }
        currensyCount.addEventListener('change', function () {
            currentContext.getCurrencyToCallback(currentContext.allBankBudget);
        });
    }
    getAmountDebt() {
        let currentContext = this.getThis();
        currentContext.getCurrencyToCallback(currentContext.budget);
    }
    getAmountDebtClients() {
        let currentContext = this.getThis();
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        formAdd.setAttribute('id', 'formDebt')
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        let labelActive = document.createElement('LABEL') as HTMLLabelElement;
        formAdd.appendChild(labelActive);
        let inputActive = document.createElement('INPUT') as HTMLInputElement;
        inputActive.setAttribute('name', 'activity');
        inputActive.setAttribute('type', 'radio');
        inputActive.setAttribute('value', 'true');
        inputActive.className = 'checkbox';
        labelActive.innerHTML = 'Активный';
        labelActive.appendChild(inputActive);
        let labelInactive = document.createElement('LABEL') as HTMLLabelElement;
        formAdd.appendChild(labelInactive);
        let inputInactive = document.createElement('INPUT') as HTMLInputElement;
        inputInactive.setAttribute('name', 'activity');
        inputInactive.setAttribute('value', 'false');
        inputInactive.setAttribute('type', 'radio');
        inputInactive.className = 'checkbox';
        labelInactive.innerHTML = 'Не активный';
        labelInactive.appendChild(inputInactive);
        let result = document.createElement('DIV') as HTMLDivElement;
        result.className = 'result';
        result.setAttribute('id', 'resultValue');
        formAdd.appendChild(result);
        let ok = document.createElement('DIV') as HTMLDivElement;
        ok.className = 'button';
        ok.setAttribute('id', 'okResult');
        ok.innerHTML = 'OK';
        formAdd.appendChild(ok);
        let checkboxs = document.querySelectorAll('.checkbox');
        checkboxs.forEach(function (check) {
            check.addEventListener('click', function (event) {
                let active = (event.target as HTMLSelectElement).value;
                currentContext.countDebtor(Boolean(active));
                ok.addEventListener('click', function () {
                    formAdd.remove();
                    result.remove();
                    ok.remove();
                    let chooseAction = document.getElementById('chooseAction');
                    if (chooseAction) {
                        (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                    }
                });
            });
        });
    }
    getSumDebtClientsByActivity() {
        let currentContext = this.getThis();
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM') as HTMLFormElement;
        formAdd.setAttribute('id', 'formDebt')
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        let labelActive = document.createElement('LABEL') as HTMLLabelElement;
        formAdd.appendChild(labelActive);
        let inputActive = document.createElement('INPUT') as HTMLInputElement;
        inputActive.setAttribute('name', 'activity');
        inputActive.setAttribute('type', 'radio');
        inputActive.setAttribute('value', 'true');
        inputActive.className = 'checkbox';
        labelActive.innerHTML = 'Активный';
        labelActive.appendChild(inputActive);
        let labelInactive = document.createElement('LABEL') as HTMLLabelElement;
        formAdd.appendChild(labelInactive);
        let inputInactive = document.createElement('INPUT') as HTMLInputElement;
        inputInactive.setAttribute('name', 'activity');
        inputInactive.setAttribute('value', 'false');
        inputInactive.setAttribute('type', 'radio');
        inputInactive.className = 'checkbox';
        labelInactive.innerHTML = 'Не активный';
        labelInactive.appendChild(inputInactive);
        let result = document.createElement('DIV') as HTMLDivElement;
        result.className = 'result';
        result.setAttribute('id', 'resultValue');
        formAdd.appendChild(result);
        let ok = document.createElement('DIV') as HTMLDivElement;
        ok.className = 'button';
        ok.setAttribute('id', 'okResult');
        ok.innerHTML = 'OK';
        formAdd.appendChild(ok);
        let checkboxs = document.querySelectorAll('.checkbox');
        checkboxs.forEach(function (check) {
            check.addEventListener('click', function (event) {
                let active = (event.target as HTMLSelectElement).value;
                currentContext.countSumDebtor(Boolean(active));
                ok.addEventListener('click', function () {
                    formAdd.remove();
                    result.remove();
                    ok.remove();
                    let chooseAction = document.getElementById('chooseAction');
                    if (chooseAction) {
                        (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                    }
                });
            });
        });
    }
    setActiveByClientId(isActive: boolean, clientId: number) {
        for (let item of this.clients) {
            if (item.id === clientId) {
                item.is_active = isActive;
                break;
            }
        }
    }
    addAmountBill(clientId: number, type: string, amount: number) {
        for (let client of this.clients) {
            if (client.id === clientId) {
                if (client.bills) {
                    for (let element of client.bills) {
                        if (element.type === type) {
                            element.amount = amount;
                        }
                    }
                }
            }
        }
    }
    async getCurrencyToCallback(callback: Bank["budget"] | Bank["allBankBudget"]) {
        let currentContext = this.getThis();
        let response = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        let data: Data[] = await response.json();
        if (callback === currentContext.budget) {
            callback(data, true, 'USD');
        } else if (callback === currentContext.allBankBudget) {
            callback(data, 'USD');
        }
    }
    budget(data: Data[], isActive: boolean, currency: string): number {
        let currentContext = this.getThis();
        let sum = 0;
        let rate = 1;
        for (let item of currentContext.clients) {
            if (item.is_active === isActive) {
                if (item.bills) {
                    for (let i = 0; i < item.bills.length; i++) {
                        if (item.bills[i].type === 'credit') {
                            for (let element of data) {
                                if (element.ccy === "USD") {
                                    rate = parseInt(element.buy);
                                }
                            }
                            let value = item.bills[i].limit;
                            if (typeof value === 'number') {
                                sum += (value - item.bills[i].amount) / rate;
                            }
                        }
                    }
                }
            }
        }
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.createElement('FORM');
        if (divWorkSpace) {
            divWorkSpace.appendChild(formAdd);
        }
        let result = document.createElement('DIV');
        result.className = 'result';
        result.innerHTML = String(sum);
        formAdd.appendChild(result);
        let ok = document.createElement('DIV');
        ok.className = 'button';
        ok.innerHTML = 'OK';
        formAdd.appendChild(ok);
        ok.addEventListener('click', function () {
            formAdd.remove();
            let chooseAction = document.getElementById('chooseAction');
            if (chooseAction) {
                (chooseAction as HTMLSelectElement).value = 'Выберите действие';
            }
        });
        return sum;
    }
    allBankBudget(data: Data[], currency: string): number {
        let currentContext = this.getThis();
        let sum = 0;
        let rate = 1;
        for (let item of currentContext.clients) {
            if (item.bills) {
                for (let i = 0; i < item.bills.length; i++) {
                    if (item.bills[i].type === 'debet') {
                        for (let element of data) {
                            if (element.ccy === currency) {
                                rate = Number(element.buy);
                            }
                        }
                        if (typeof item.bills[i].amount === 'number') {
                            sum += item.bills[i].amount / rate;
                        }
                    } else if (item.bills[i].type === 'credit') {
                        sum += item.bills[i].amount;
                    }
                }
            }
            let divWorkSpace = document.getElementById('workSpace');
            let formAdd = document.createElement('FORM');
            if (divWorkSpace) {
                divWorkSpace.appendChild(formAdd);
            }
            let result = document.createElement('DIV');
            result.className = 'result';
            result.innerHTML = String(sum);
            formAdd.appendChild(result);
            let ok = document.createElement('DIV');
            ok.className = 'button';
            ok.innerHTML = 'OK';
            formAdd.appendChild(ok);
            ok.addEventListener('click', function () {
                result.remove();
                let currensyCounter = document.getElementById('currensyCounter');
                if (currensyCounter) {
                    currensyCounter.remove();
                }
                ok.remove();
                let chooseAction = document.getElementById('chooseAction');
                if (chooseAction) {
                    (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                }
            });
        }
        return sum;
    }
    countDebtor(isActive: boolean): number {
        let currentContext = this.getThis();
        let counter = 0;
        for (let item of currentContext.clients) {
            if (item.is_active) {
                if (item.is_active.toString() === isActive.toString()) {
                    if (item.bills) {
                        for (let i = 0; i < item.bills.length; i++) {
                            let value = item.bills[i].limit;
                            if (typeof value === 'number') {
                                if (item.bills[i].amount < value)
                                    counter++;
                            }
                        }
                    }
                }
            }
            let divWorkSpace = document.getElementById('workSpace');
            let formAdd = document.getElementById('formDebt');
            if (divWorkSpace && formAdd) {
                divWorkSpace.appendChild(formAdd);
            }
            let result = document.getElementById('resultValue');
            if (result) {
                result.innerHTML = String(counter);
            }
            let ok = document.getElementById('okResult');
            if (ok && formAdd) {
                ok.innerHTML = 'OK';
                formAdd.appendChild(ok);

                ok.addEventListener('click', function () {
                    if (result && ok) {
                        result.remove();
                        ok.remove();
                    }
                    let chooseAction = document.getElementById('chooseAction');
                    if (chooseAction) {
                        (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                    }
                });
            }
        }
        return counter;
    }
    countSumDebtor(isActive:boolean) {
        let currentContext = this.getThis();
        let counter = 0;
        let sum = 0;
        for (let item of currentContext.clients) {
            if (item.is_active) {
                if (item.is_active.toString() === isActive.toString()) {
                    if (item.bills) {
                        for (let i = 0; i < item.bills.length; i++) {
                            let value = item.bills[i].limit;
                            if (typeof value === 'number') {
                                if (item.bills[i].amount < value)
                                    sum += value - item.bills[i].amount;
                            }
                        }
                    }
                }
            }
        }
        let divWorkSpace = document.getElementById('workSpace');
        let formAdd = document.getElementById('formDebt');
        if (divWorkSpace && formAdd) {
            divWorkSpace.appendChild(formAdd);
        }
        let result = document.getElementById('resultValue');
        if (result) {
            result.innerHTML = String(sum);
        }
        let ok = document.getElementById('okResult');
        if (ok && formAdd) {
            ok.innerHTML = 'OK';
            formAdd.appendChild(ok);
            ok.addEventListener('click', function () {
                if (result && ok) {
                    result.remove();
                    ok.remove();
                }
                let chooseAction = document.getElementById('chooseAction');
                if (chooseAction) {
                    (chooseAction as HTMLSelectElement).value = 'Выберите действие';
                }
            });
        }
        return sum;
    }
}
let myBank = new Bank();