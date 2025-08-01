import { DraggableScroller } from '/lib/utils/DraggableScroller.js';
import { PopupManager } from '/lib/utils/PopupManager.js';
import { InputNumberElement } from '/lib/utils/InputNumberElement.js';

import { MESSAGE_DISPLAY_DURATION, SKILL_CALCULATOR_SETTINGS_KEY
    , MIN_AUTO_INPUT, MAX_AUTO_INPUT, MIN_AUTO_INPUT_INCREMENT, MAX_AUTO_INPUT_INCREMENT
    , DEFAULT_AUTO_INPUT_START, DEFAULT_AUTO_INPUT_END, DEFAULT_AUTO_INPUT_INCREMENT
    , MIN_X_VALUES_COUNT, MAX_X_VALUES_COUNT
} from '/data.js';

import { RankTableViewModel } from '/components/skill/comparison/table/RankTableViewModel.js';
import { CharacterTableViewModel } from '/components/skill/comparison/table/CharacterTableViewModel.js';
import { RankPanelViewModel } from '/components/rank/RankPanelViewModel.js';
import { BackupViewModel } from '/components/backup/BackupViewModel.js';

export class App {
    constructor() {
        this.messageDisplayElement = document.getElementById('message-display');
        
        this.RankPanelViewModel = new RankPanelViewModel(null, this.messageDisplay.bind(this));
        
        this.RankTableViewModel = new RankTableViewModel({
            containerId: 'rank-skill-container',
            messageDisplayCallback: this.messageDisplay.bind(this),
            displayModeBtnId: 'btn-display-mode',
            numberFormatBtnId: 'btn-number-format'
        });
        
        this.CharacterTableViewModel = new CharacterTableViewModel({
            containerId: 'character-skill-container',
            messageDisplayCallback: this.messageDisplay.bind(this),
            RankPanelViewModel: this.RankPanelViewModel,
            displayModeBtnId: 'btn-display-mode-char',
            numberFormatBtnId: 'btn-number-format-char'
        });

        this.BackupViewModel = new BackupViewModel(
            'backup-panel',
            this.messageDisplay.bind(this),
            this.RankPanelViewModel.getCharacterRanks.bind(this.RankPanelViewModel),
            this.RankPanelViewModel.setCharacterRanks.bind(this.RankPanelViewModel)
        );

        this.popupManager = new PopupManager();
        this.popupManager.onOpen('character-ranks-panel', () => {
            this.RankPanelViewModel.renderCharacterRanks('character-ranks-content');
        });
        this.popupManager.onOpen('backup-panel', () => {
            this.BackupViewModel.displayUserId();
        });

        this.initAutoInputPanel();
        this.initTabNavigation();
        this.initDraggableScrolling(); 
        this.bindCustomEvents();
    }
    
    initAutoInputPanel() {
        const autoInputPanel = document.getElementById('auto-input-panel');
        const applyBtn = autoInputPanel.querySelector('#applyAutoInputBtn');
        const startInput = autoInputPanel.querySelector('#auto-input-start');
        const endInput = autoInputPanel.querySelector('#auto-input-end');
        const incrementInput = autoInputPanel.querySelector('#auto-input-increment');

        const startElement = new InputNumberElement(startInput, MIN_AUTO_INPUT, MAX_AUTO_INPUT, DEFAULT_AUTO_INPUT_START, null);
        const endElement = new InputNumberElement(endInput, MIN_AUTO_INPUT, MAX_AUTO_INPUT, DEFAULT_AUTO_INPUT_END, null);
        const incrementElement = new InputNumberElement(incrementInput, MIN_AUTO_INPUT_INCREMENT, MAX_AUTO_INPUT_INCREMENT, DEFAULT_AUTO_INPUT_INCREMENT, null);

        let activeTable = null;

        this.popupManager.onOpen('auto-input-panel', (trigger) => {
            activeTable = trigger.id.includes('-char')
                ? this.CharacterTableViewModel 
                : this.RankTableViewModel;

            const settings = JSON.parse(localStorage.getItem(SKILL_CALCULATOR_SETTINGS_KEY) || '{}');
            startElement.setValue(settings.autoInputStart || DEFAULT_AUTO_INPUT_START, false);
            endElement.setValue(settings.autoInputEnd || DEFAULT_AUTO_INPUT_END, false);
            incrementElement.setValue(settings.autoInputIncrement || DEFAULT_AUTO_INPUT_INCREMENT, false);
        });

        applyBtn.addEventListener('click', () => {
            if (!activeTable) return;

            let startVal = startElement.getValue();
            let endVal = endElement.getValue();
            let incrementVal = incrementElement.getValue();
            
            if (startVal > endVal) [startVal, endVal] = [endVal, startVal];
            if (incrementVal <= 0) incrementVal = 1;

            let generatedXValues = [];
            for (let i = startVal; i <= endVal; i += incrementVal) { generatedXValues.push(i); }
            
            // --- 핵심 수정: X축 개수 제한 로직 추가 ---
            if (generatedXValues.length < MIN_X_VALUES_COUNT) {
                this.messageDisplay('생성된 대상값이 최소 개수에 미치지 못하여 빈공간을 생성합니다.', 'info');
                while (generatedXValues.length < MIN_X_VALUES_COUNT) {
                    generatedXValues.push(0);
                }
            } else if (generatedXValues.length > MAX_X_VALUES_COUNT) {
                this.messageDisplay('생성된 대상값이 최대 개수를 초과하였습니다.', 'info');
                generatedXValues = generatedXValues.slice(0, MAX_X_VALUES_COUNT);
            }

            activeTable.updateXValuesAndRender(generatedXValues);
            
            this.popupManager.close(autoInputPanel);
        });
    }

    messageDisplay(message, type) {
        if (this.messageDisplayElement) {
            this.messageDisplayElement.textContent = message;
            this.messageDisplayElement.className = `message ${type}`;
            setTimeout(() => {
                this.messageDisplayElement.className = 'message';
                this.messageDisplayElement.textContent = '';
            }, MESSAGE_DISPLAY_DURATION);
        }
    }

    initTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-buttons .tab-button');
        const tabContents = document.querySelectorAll('.tab-content-wrapper .tab-content');

        const activateTab = (tabButton) => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabButton.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));

            const targetTabId = tabButton.dataset.tab;
            const targetTabContent = document.getElementById(targetTabId);
            if (targetTabContent) {
                targetTabContent.classList.add('active');
                if (targetTabId === 'character-skill-tab') {
                    this.CharacterTableViewModel.refresh();
                }
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => activateTab(button));
        });

        const initialActiveTabButton = document.querySelector('.tab-buttons .tab-button.active');
        if (initialActiveTabButton) {
            activateTab(initialActiveTabButton);
        }
    }

    initDraggableScrolling() {
        const draggableElements = document.querySelectorAll('.draggable-on-mobile');
        draggableElements.forEach(el => new DraggableScroller(el));
    }

    bindCustomEvents() {
        document.body.addEventListener('characterRanksUpdated', () => {
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab && activeTab.dataset.tab === 'character-skill-tab') {
                this.CharacterTableViewModel.refresh();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});