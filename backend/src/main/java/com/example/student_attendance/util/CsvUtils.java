package com.example.student_attendance.util;

import java.util.ArrayList;
import java.util.List;

public final class CsvUtils {

    private CsvUtils() {
    }

    public static List<String> parseLine(String line) {
        List<String> fields = new ArrayList<>();

        if (line == null || line.isEmpty()) {
            fields.add("");
            return fields;
        }

        StringBuilder field = new StringBuilder();
        boolean quoted = false;

        for (int index = 0; index < line.length(); index++) {
            char current = line.charAt(index);

            if (current == '"') {
                if (quoted && index + 1 < line.length()
                        && line.charAt(index + 1) == '"') {
                    field.append('"');
                    index++;
                } else {
                    quoted = !quoted;
                }
            } else if (current == ',' && !quoted) {
                fields.add(field.toString());
                field.setLength(0);
            } else {
                field.append(current);
            }
        }

        if (quoted) {
            throw new IllegalArgumentException("Malformed CSV row: unclosed quote");
        }

        fields.add(field.toString());
        return fields;
    }
}
