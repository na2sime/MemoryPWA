import {rem} from "@mantine/core";
import {useDebouncedState} from "@mantine/hooks";
import {Spotlight} from "@mantine/spotlight";
import {IconCards, IconSearch, IconSquare} from "@tabler/icons-react";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {NoteSorts} from "../../logic/NoteSorting";
import {getUtils} from "../../logic/TypeManager";
import {NoteType} from "../../logic/card";
import {determineSuperDecks, getDeck, useDecks} from "../../logic/deck";
import {Note, useNotesWith} from "../../logic/note";
import classes from "./Spotlight.module.css";

interface NoteWithPreview extends Note<NoteType> {
    breadcrumb: string[];
}

const useSearchNote = (filter: string) => {
    const [filteredNotes, setFilteredNotes] = useState<NoteWithPreview[]>([]);
    const [notes] = useNotesWith(
        (n) =>
            n
                .toArray()
                .then((m) =>
                    m
                        .filter((note) =>
                            getUtils(note)
                                .getSortFieldFromNoteContent(note.content)
                                .toLowerCase()
                                .includes(filter.toLowerCase())
                        )
                        .sort(NoteSorts.bySortField(1))
                ),
        [filter]
    );
    useEffect(() => {
        async function filterNotes(notes: Note<NoteType>[]) {
            const decksPromises = notes?.map(async (note) => {
                const deck = await getDeck(note.deck);
                const superDecks = await determineSuperDecks(deck);
                return [
                    ...(superDecks[0] || []).map((sd) => sd.name),
                    deck?.name || "Empty",
                ];
            });
            const decks = await Promise.all(decksPromises);
            setFilteredNotes(
                notes.map((note, i) => ({
                    ...note,
                    breadcrumb: decks[i],
                }))
            );
        }

        filterNotes(notes || []);
    }, [notes]);

    return filteredNotes;
};

export default function SpotlightCard() {
    const navigate = useNavigate();

    const [filter, setFilter] = useDebouncedState("", 250);
    const [filteredDecks] = useDecks();
    const filteredNotes = useSearchNote(filter);

    const possibleActions = [
        {
            group: "Decks",
            actions: [
                ...(filteredDecks || []).map((deck) => {
                    return {
                        id: deck.id,
                        label: deck.name,
                        description: deck.description,
                        onClick: () => navigate(`/deck/${deck.id}`),
                        leftSection: (
                            <IconCards
                                style={{width: rem(24), height: rem(24)}}
                                stroke={1.5}
                            />
                        ),
                    };
                }),
            ],
        },
        {
            group: "Notes",
            actions: [
                ...filteredNotes.map((note) => {
                    return {
                        id: note.id,
                        label: getUtils(note).getSortFieldFromNoteContent(note.content),
                        description: note.breadcrumb.join(" > "),
                        onClick: () => navigate(`/deck/${note.deck}`),
                        leftSection: (
                            <IconSquare
                                style={{width: rem(24), height: rem(24)}}
                                stroke={1.5}
                            />
                        ),
                    };
                }),
            ],
        },
    ];

    return (
        <Spotlight
            className={classes.spotlight}
            actions={possibleActions}
            closeOnClickOutside
            nothingFound={t("spotlight.no-results")}
            highlightQuery
            onQueryChange={setFilter}
            limit={10}
            scrollable={true}
            searchProps={{
                leftSection: (
                    <IconSearch
                        style={{width: rem(20), height: rem(20)}}
                        stroke={1.5}
                    />
                ),
                placeholder: "Search...",
            }}
        />
    );
}
