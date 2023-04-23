<script lang="ts">
    import { browser } from '$app/environment';

    const speechSynthesis = browser ? window.speechSynthesis : undefined;
       
    import type { computeAccessibleDescription } from 'dom-accessibility-api';
    let computeDescription: typeof computeAccessibleDescription | undefined;

    import('dom-accessibility-api').then(domAccessibilityApi => {
        computeDescription = domAccessibilityApi.computeAccessibleDescription;
    });

    let voices = getVoices();
    let selectedVoice = voices.find(voice => voice.default) ?? voices[0];
    let rate = 1;
    let pitch = 1;
    let showcaseContainer: HTMLDivElement;

    function getVoices() {
        if (!speechSynthesis) {
            return [];
        }

        return speechSynthesis.getVoices().sort(function (a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();

            if (nameA < nameB) {
                return -1;
            } else if (nameA == nameB) {
                return 0;
            } else {
                return +1;
            }
        });
    }

    if(speechSynthesis) {
        speechSynthesis.onvoiceschanged = function () {
            voices = getVoices();
        };
    }
    
    
    function selectedVoiceChanged(event: Event) {
        const elementValue = (event.target as HTMLSelectElement).value;

        const nextSelectedVoice = voices.find(voice => voice.name === elementValue);
        if (!nextSelectedVoice) {
            console.error(`Voice not found: ${elementValue}`);
            return;
        }
        
        selectedVoice = nextSelectedVoice;
    }

    function speak() {
        if (typeof speechSynthesis !== 'object') {
            console.error('Speech synthesis not supported');
            return;
        }

        if (typeof computeDescription !== 'function') {
            console.error('Could not load dom-accessibility-api');
            return;
        }

        console.log('showcaseContainer', showcaseContainer);

        const description = computeDescription(showcaseContainer, {
            compute: 'description',
            

        });
        const utterance = new SpeechSynthesisUtterance(description);
        utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        console.log('Speaking', { description });
        speechSynthesis.speak(utterance);
    }
</script>


<div>
    <div bind:this={showcaseContainer}>
        <h2>Accessibility Showcase</h2>
        <div>
            <p>TEST</p>
        </div>
        <p>
            This is a showcase of some accessibility features. It is not meant to be a complete list of all features.
        </p>
    </div>

    <select title="Voice" on:select={selectedVoiceChanged}>
        {#each voices as voice}
            <option value={voice.name} selected="{selectedVoice?.lang === voice.lang}">{voice.name}</option>
        {/each}
    </select>

    <label>
        Rate
        <input type="range" min="0.5" max="2" bind:value="{rate}" step="0.1" />
    </label>

    <label>
        Pitch
        <input type="range" min="0" max="2" bind:value="{pitch}" step="0.1" />
    </label>

    <button type="button" on:click={speak}>Speak</button>
</div>