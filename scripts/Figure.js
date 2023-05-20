// Figure classes
// Contain a static settings object, 
// A static function generate that generates a list of WebMidi.Note objects
//      given a seed and using the global tempo setting

function note(pitch, duration) {
    const note = new Note(pitch, {duration: noteDuration(duration), attack: 0.3});
    note.barDuration = duration;
    return note;
}

function rest(duration) {
    return new Note("C2", {duration: noteDuration(duration), attack: 0});
}

class EmptyFigure {
    static measures = 1;
    static settings = {};
    static displayName = "No name found for figure";

    static generate(seed) {
        return [];
    }
}

class KnownStartRootFigure extends EmptyFigure {
    static measures = 1;
    static displayName = "Known start note, one interval."
    static settings = {
        root: "C2",
        intervals: major
    }

    static generate(seed) {
        const s = KnownStartRootFigure.settings;
        const root = note(s.root, quarter);
        const next = note(root.getOffsetNumber() + choice(s.intervals), quarter);
        return [root, next];
    }
}

class KnownEndRootFigure extends EmptyFigure {
    static measures = 1;
    static displayName = "Known last note, one interval.";
    static settings = {
        root: "C2",
        intervals: major
    }

    static generate(seed) {
        const notes = KnownStartRootFigure.generate(seed);
        return [notes[1], notes[0]];
    }
}

class ShortAscendingFigure extends EmptyFigure {
    static measures = 1;
    static displayName = "Three note ascending figure.";
    static settings = {
        root: "C2",
        intervals: major
    }

    static generate(seed) {
        const s = ShortAscendingFigure.settings;
        const root = note(s.root, quarter);
        let upperNotes = [choice(s.intervals), choice(s.intervals)].sort((a, b) => a - b);
        upperNotes = upperNotes.map(interval => note(root.getOffsetNumber() + interval, quarter));
        return [root, ...upperNotes];
    }
}

class EighthNoteRythmFigure extends EmptyFigure {
    static measures = 1;
    static displayName = "Four note rythmic figure.";
    static settings = {
        root: "D2"
    }

    static generate(seed) {
        const durations = [quarter, quarter, eighth, eighth];
        const notes = []
        while (durations.length > 0) {
            notes.push(note(EighthNoteRythmFigure.settings.root, takeRandom(durations)));
        }

        return notes;
    }
}

class RandomRootRythmFigure extends EmptyFigure {
    static measures = 1;
    static displayName = "Rythm in random note of the scale.";
    static settings = {
        root: "C2",
        intervals: "major"
    }

    static generate(seed) {
        const durations = [quarter, quarter, eighth, eighth];
        const root = note(RandomRootRythmFigure.settings.root, quarter);
        const offset = choice(RandomRootRythmFigure.settings.intervals);
        const notes = []
        while (durations.length > 0) {
            notes.push(note(root.getOffsetNumber() + offset, takeRandom(durations)));
        }

        return notes;
    }
}


const classNames = {
    "KnownStartRoot": KnownStartRootFigure,
    "KnownEndRoot": KnownEndRootFigure,
    "EighthNoteRythm": EighthNoteRythmFigure,
    "ShortAscending": ShortAscendingFigure,
    "RandomRootRythm": RandomRootRythmFigure,
}