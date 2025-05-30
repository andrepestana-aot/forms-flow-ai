import React from "react";
import { FilterIcon, RefreshIcon, SortModal, CustomButton } from "@formsflow/components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const FilterSortActions = ({
  showSortModal,
  handleFilterIconClick,
  handleRefresh,
  handleSortModalClose,
  handleSortApply,
  defaultSortOption,
  defaultSortOrder,
  optionSortBy,
  filterDataTestId,
  filterAriaLabel,
  refreshDataTestId,
  refreshAriaLabel,
}) => {
  const { t } = useTranslation();

  return (
    <>
      
      <CustomButton
        variant="outline-secondary"
        icon={<FilterIcon />}
        iconOnly={true}
        onClick={handleFilterIconClick}
        dataTestId={filterDataTestId}
        ariaLabel={filterAriaLabel}
      />

      <CustomButton
        variant="outline-secondary"
        icon={<RefreshIcon />}
        iconOnly={true}
        onClick={handleRefresh}
        dataTestId={refreshDataTestId}
        ariaLabel={refreshAriaLabel}
      />
     

      {showSortModal && (
        <SortModal
          firstItemLabel={t("Sort By")}
          secondItemLabel={t("In a")}
          showSortModal={showSortModal}
          onClose={handleSortModalClose}
          primaryBtnAction={handleSortApply}
          modalHeader={t("Sort")}
          primaryBtnLabel={t("Sort Results")}
          secondaryBtnLabel={t("Cancel")}
          optionSortBy={optionSortBy}
          optionSortOrder={[
            { value: "asc", label: t("Ascending") },
            { value: "desc", label: t("Descending") },
          ]}
          defaultSortOption={defaultSortOption}
          defaultSortOrder={defaultSortOrder}
          primaryBtndataTestid="apply-sort-button"
          secondaryBtndataTestid="cancel-sort-button"
          primaryBtnariaLabel={t("Apply sorting")}
          secondaryBtnariaLabel={t("Cancel sorting")}
          closedataTestid="close-sort-modal"
        />
      )}
    </>
  );
};

FilterSortActions.propTypes = {
  showSortModal: PropTypes.bool.isRequired,
  handleFilterIconClick: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleSortModalClose: PropTypes.func.isRequired,
  handleSortApply: PropTypes.func.isRequired,
  defaultSortOption: PropTypes.string.isRequired,
  defaultSortOrder: PropTypes.string.isRequired,
  optionSortBy: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  filterDataTestId: PropTypes.string.isRequired,
  filterAriaLabel: PropTypes.string.isRequired,
  refreshDataTestId: PropTypes.string.isRequired,
  refreshAriaLabel: PropTypes.string.isRequired,
};

export default FilterSortActions;
