import {
    ActionIcon,
    Box,
    Group,
    NavLink,
    Stack,
    Text,
    Title,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {
    IconCards,
    IconHome,
    IconPlus,
    IconSettings,
    IconX,
} from "@tabler/icons-react";
import cx from "clsx";
import {t} from "i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTopLevelDecks} from "../../logic/deck";
import NewDeckModal from "../deck/NewDeckModal";
import DeckTree from "./DeckTree";
import classes from "./Sidebar.module.css";

import SpotlightCard from "./Spotlight";

const InteractiveNavLink = ({
                                label,
                                path,
                                icon,
                                minimalMode,
                                fullscreenMode,
                                closeMenu,
                            }: {
    label: string;
    path: string;
    icon: JSX.Element;
    minimalMode: boolean;
    fullscreenMode: boolean;
    closeMenu: () => void;
}) => {
    const navigate = useNavigate();
    return (
        <Tooltip
            label={label}
            disabled={!minimalMode || fullscreenMode}
            position="right"
            keepMounted={false}
        >
            <NavLink
                classNames={{
                    root: classes.sidebarItem,
                    body: classes.sidebarItemBody,
                    label: classes.sidebarItemLabel,
                    section: classes.sidebarItemIcon,
                }}
                variant="subtle"
                label={label}
                leftSection={icon}
                onClick={() => {
                    navigate(path);
                    fullscreenMode && closeMenu();
                }}
                active={location.pathname.startsWith(path)}
            />
        </Tooltip>
    );
};

function Sidebar({menuOpened,
                     menuHandlers,
                 }: Readonly<{
    menuOpened: boolean;
    menuHandlers: {
        readonly open: () => void;
        readonly close: () => void;
        readonly toggle: () => void;
    };
}>) {
    const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
    const theme = useMantineTheme();

    const fullscreenMode = !!useMediaQuery(
        "(max-width: " + theme.breakpoints.xs + ")"
    );
    const isXsLayout = useMediaQuery("(min-width: " + theme.breakpoints.sm + ")");
    const minimalMode = !!useMediaQuery(
        "(max-width: " +
        theme.breakpoints.lg +
        ") and (min-width: " +
        theme.breakpoints.xs +
        ")"
    );

    const landscapeMode = useMediaQuery("(orientation: landscape)");
    const [decks, isReady] = useTopLevelDecks();

    return (
        <Box
            p="0.5rem"
            className={cx(
                classes.sidebar,
                minimalMode && classes.minimalMode,
                landscapeMode && classes.landscapeMode,
                fullscreenMode && classes.fullscreenMode,
                fullscreenMode && menuOpened && classes.fullscreenModeOpened
            )}
        >
            <Stack gap="xs">
                <Group className={classes.topRow}>
                    <Group gap="xs" align="center">
                        <Title order={5}>MemoryPWA</Title>
                    </Group>
                    {fullscreenMode ? (
                        <ActionIcon
                            onClick={menuHandlers.close}
                            style={{alignSelf: "end"}}
                            variant="subtle"
                        >
                            <IconX/>
                        </ActionIcon>
                    ) : null}
                </Group>
                <SpotlightCard/>

                <InteractiveNavLink
                    label={t("home.title")}
                    path="/home"
                    icon={<IconHome/>}
                    minimalMode={minimalMode}
                    fullscreenMode={fullscreenMode}
                    closeMenu={menuHandlers.close}
                />
                <InteractiveNavLink
                    label={t("manage-cards.title")}
                    path="/notes"
                    icon={<IconCards/>}
                    minimalMode={minimalMode}
                    fullscreenMode={fullscreenMode}
                    closeMenu={menuHandlers.close}
                />
                <InteractiveNavLink
                    label={t("settings.title")}
                    path="/settings"
                    icon={<IconSettings/>}
                    minimalMode={minimalMode}
                    fullscreenMode={fullscreenMode}
                    closeMenu={menuHandlers.close}
                />
            </Stack>
            {isXsLayout && !minimalMode && (
                <>
                    <Text c="dimmed" p="xs" pt="md" fz="sm">
                        {t("sidebar.decks-title")}
                    </Text>
                    {isReady &&
                        decks?.map((deck) => <DeckTree deck={deck} key={deck.id}/>)}
                    <NavLink
                        label={
                            <Text c="dimmed" fz="xs">
                                {t("sidebar.decks-add")}
                            </Text>
                        }
                        onClick={() => setNewDeckModalOpened(true)}
                        leftSection={<IconPlus size={"1rem"} color={"gray"}/>}
                    />
                    <NewDeckModal
                        opened={newDeckModalOpened}
                        setOpened={setNewDeckModalOpened}
                    />
                </>
            )}
        </Box>
    );
}

export default Sidebar;
