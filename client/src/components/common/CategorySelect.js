import React from "react";
import { Select } from "@chakra-ui/react";
import { extractChapterNumber } from "../../utils/helpers"; // Import the updated extractChapterNumber function

// CategorySelect component is a dropdown menu to select flashcard categories
const CategorySelect = ({
  categories,
  selectedCategory,
  handleCategoryChange,
}) => {
  // Sort categories numerically by chapter number
  const sortedCategories = [...categories].sort((a, b) => {
    const numA = extractChapterNumber(a) || 0;
    const numB = extractChapterNumber(b) || 0;
    return numA - numB;
  });

  return (
    <Select
      value={selectedCategory}
      onChange={handleCategoryChange}
      maxWidth="300px"
      mb="20px"
    >
      {/* Map through each category in the sortedCategories array */}
      {sortedCategories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
