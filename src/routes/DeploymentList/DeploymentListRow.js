import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import CloudIcon from "@material-ui/icons/Cloud";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  makeStyles,
  IconButton,
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Chip,
  CircularProgress,
  Checkbox
} from "@material-ui/core";
import { useHistory } from "react-router";
import { useLocalNotes } from "../../context/LocalNoteProvider";
import { useLeaseList } from "../../queries";
import { useWallet } from "../../context/WalletProvider";
import { StatusPill } from "../../shared/components/StatusPill";
import { SpecDetail } from "../../shared/components/SpecDetail";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  },
  titleContainer: {
    paddingBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  listItemText: {
    margin: 0,
    padding: ".8rem .5rem",
    cursor: "pointer",
    transition: ".3s all ease",
    "&:hover": {
      backgroundColor: theme.palette.grey[100]
    }
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold"
  },
  dseq: {
    display: "inline",
    fontSize: "12px"
  },
  leaseChip: {
    marginLeft: ".5rem"
  }
}));

export function DeploymentListRow({ deployment, isSelectable, onSelectDeployment, checked }) {
  const classes = useStyles();
  const history = useHistory();
  const { getDeploymentName } = useLocalNotes();
  const { address } = useWallet();
  const { data: leases, isLoading: isLoadingLeases } = useLeaseList(deployment, address, { enabled: !!deployment && deployment.state === "active" });

  function viewDeployment() {
    history.push("/deployment/" + deployment.dseq);
  }

  const name = getDeploymentName(deployment.dseq);

  return (
    <ListItem key={deployment.dseq} classes={{ root: classes.root }}>
      <ListItemIcon>
        {deployment.state === "active" && <CloudIcon color="primary" />}
        {deployment.state === "closed" && <CancelPresentationIcon />}
      </ListItemIcon>
      <ListItemText
        className={classes.listItemText}
        onClick={viewDeployment}
        primary={
          name ? (
            <>
              <strong>{name}</strong>
              <Typography className={classes.dseq}> - {deployment.dseq}</Typography>
            </>
          ) : (
            <Typography variant="body1">{deployment.dseq}</Typography>
          )
        }
        secondaryTypographyProps={{ component: "div" }}
        secondary={
          <>
            <Box display="flex" alignItems="center" marginBottom="4px">
              <SpecDetail
                cpuAmount={deployment.cpuAmount}
                memoryAmount={deployment.memoryAmount}
                storageAmount={deployment.storageAmount}
                size="small"
                color={deployment.state === "active" ? "primary" : "default"}
                gutterSize="small"
              />
            </Box>

            {leases && !!leases.length && (
              <Box display="flex" alignItems="center">
                Leases:{" "}
                {leases?.map((lease) => (
                  <Chip
                    key={lease.id}
                    size="small"
                    className={classes.leaseChip}
                    label={
                      <>
                        <span>GSEQ: {lease.gseq}</span>
                        <Box component="span" marginLeft=".5rem">
                          OSEQ: {lease.oseq}
                        </Box>
                        <Box component="span" marginLeft=".5rem">
                          Status: {lease.state}
                        </Box>
                      </>
                    }
                    icon={<StatusPill state={lease.state} size="small" />}
                  />
                ))}
              </Box>
            )}

            {isLoadingLeases && <CircularProgress size="1rem" />}
          </>
        }
      />
      <ListItemSecondaryAction>
        {isSelectable && (
          <Checkbox
            checked={checked}
            size="medium"
            onChange={(event) => {
              onSelectDeployment(event.target.checked, deployment.dseq);
            }}
          />
        )}

        <IconButton edge="end" onClick={viewDeployment}>
          <ChevronRightIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
