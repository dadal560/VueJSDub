<?php

namespace App\Encoder;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Encoder\DecoderInterface;

final class MultipartDecoder implements DecoderInterface
{
    public const FORMAT = 'multipart';

    public function __construct(private readonly RequestStack $requestStack)
    {
    }

    public function decode(string $data, string $format, array $context = []): ?array
    {
        $request = $this->requestStack->getCurrentRequest();
        if (!$request) {
            return null;
        }

        return array_map(static function (string $element) {
                $trimmed = trim($element);

                if ($trimmed === '') {
                    return $trimmed;
                }

                if (str_starts_with($trimmed, '{') || str_starts_with($trimmed, '[') || $trimmed === 'true' || $trimmed === 'false' || is_numeric($trimmed)) {
                    try {
                        return json_decode($element, true, flags: \JSON_THROW_ON_ERROR);
                    } catch (\JsonException) {
                    }
                }

                return $element;
            }, $request->request->all()) + $request->files->all();
    }

    public function supportsDecoding(string $format): bool
    {
        return self::FORMAT === $format;
    }
}