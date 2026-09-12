"use client";

import { useState } from "react";

import {
    Box,
    Dialog,
    Heading,
    Image,
    SimpleGrid,
    Text,
    VStack
} from "@chakra-ui/react";

import type { CDRelease } from "./page";

export default function CDClient({ releases }: { releases: CDRelease[] }) {
    const [selectedRelease, setSelectedRelease] = useState<CDRelease | null>(
        null
    );

    return (
        <>
            <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
                <VStack align="stretch" gap={8}>
                    <Box>
                        <Heading size="2xl">Physical CDs</Heading>

                        <Text mt={2} color="fg.muted">
                            {releases.length} releases
                        </Text>
                    </Box>

                    <SimpleGrid
                        columns={{
                            base: 2,
                            sm: 3,
                            md: 4,
                            lg: 5,
                            xl: 6
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

                                <Box p={4}>
                                    <Text
                                        fontWeight="600"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                    >
                                        {release.title}
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="sm"
                                        color="fg.muted"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                    >
                                        {release.artist}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                </VStack>
            </Box>

            <Dialog.Root
                open={selectedRelease !== null}
                onOpenChange={(details) => {
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

                                        <Text fontSize="lg" fontWeight="600">
                                            {selectedRelease.artist}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" color="fg.muted">
                                            Release
                                        </Text>

                                        <Text fontSize="lg" fontWeight="600">
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
}
