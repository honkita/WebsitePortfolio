"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import {
    Box,
    Dialog,
    Heading,
    Image,
    SimpleGrid,
    Text,
    VStack
} from "@chakra-ui/react";

import type { DialogOpenChangeDetails } from "@chakra-ui/react";
import type { CDRelease } from "./page";

const CDClient = ({ releases }: { releases: CDRelease[] }) => {
    const { resolvedTheme } = useTheme();
    const [selectedRelease, setSelectedRelease] = useState<CDRelease | null>(
        null
    );

    return (
        <>
            <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
                <VStack align="stretch" gap={8}>
                    <Box>
                        <Heading size="2xl" color="foreground">
                            Physical CDs
                        </Heading>

                        <Text mt={2} color="fg.muted">
                            {releases.length} releases
                        </Text>
                    </Box>

                    <SimpleGrid
                        columns={{
                            base: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 5
                        }}
                        gap={{ base: 4, md: 6 }}
                    >
                        {releases.map((release) => (
                            <Box
                                key={`${release.artist}-${release.title}`}
                                cursor="pointer"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="lg"
                                overflow="hidden"
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    boxShadow: "lg"
                                }}
                                onClick={() => setSelectedRelease(release)}
                            >
                                <Image
                                    src={release.image}
                                    alt={`${release.artist} - ${release.title}`}
                                    width="100%"
                                    aspectRatio="1"
                                    objectFit="cover"
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                </VStack>
            </Box>

            <Dialog.Root
                open={selectedRelease !== null}
                onOpenChange={(details: DialogOpenChangeDetails) => {
                    if (!details.open) {
                        setSelectedRelease(null);
                    }
                }}
                size="lg"
            >
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                {selectedRelease?.title}
                            </Dialog.Title>

                            <Dialog.CloseTrigger />
                        </Dialog.Header>

                        <Dialog.Body>
                            {selectedRelease && (
                                <VStack gap={6} align="stretch">
                                    <Image
                                        src={selectedRelease.image}
                                        alt={`${selectedRelease.artist} - ${selectedRelease.title}`}
                                        width="100%"
                                        maxH="500px"
                                        objectFit="contain"
                                        borderRadius="md"
                                    />

                                    <Box>
                                        <Text fontSize="sm" color="fg.muted">
                                            Artist
                                        </Text>

                                        <Text
                                            fontSize="lg"
                                            fontWeight="600"
                                            color="fg"
                                        >
                                            {selectedRelease.artist}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" color="fg.muted">
                                            Release
                                        </Text>

                                        <Text
                                            fontSize="lg"
                                            fontWeight="600"
                                            color="fg"
                                        >
                                            {selectedRelease.title}
                                        </Text>
                                    </Box>
                                </VStack>
                            )}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};

export default CDClient;
