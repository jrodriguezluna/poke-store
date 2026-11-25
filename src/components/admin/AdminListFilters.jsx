import Form from 'react-bootstrap/Form';

export default function AdminListFilters({
  search,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterAllLabel = 'Todos',
}) {
  return (
    <div className="admin-list-toolbar">
      <Form.Control
        type="search"
        className={filterLabel ? 'mb-2' : ''}
        aria-label={searchLabel}
        placeholder={searchPlaceholder}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {filterLabel && (
        <Form.Select
          aria-label={filterLabel}
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          <option value="">{filterAllLabel}</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Form.Select>
      )}
    </div>
  );
}
