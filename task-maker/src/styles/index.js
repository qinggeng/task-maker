const container = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const v_container = {
  ...container,
  flexDirection: 'column',
};

const h_container = {
  ...container,
  flexDirection: 'row',
};

export default {
  container,
  h_container,
  v_container,
}
