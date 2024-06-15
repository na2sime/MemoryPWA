import PropTypes from 'prop-types';
import {styled} from "@mui/material";

const CustomCard = styled('div')({
    width: "100%",
    height: "100%",
    backgroundColor: "#4f4848",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
    borderRadius: "25% 10%",
    '&:hover': {
        backgroundColor: "#6f6868",
        cursor: "pointer"
    },
});


export default function Card({children, width = "100%", height = "100%", backgroundColor = "#4f4848"}) {
    return (
        <CustomCard className="card" style={{width, height, backgroundColor}}>
            {children}
        </CustomCard>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    backgroundColor: PropTypes.string
};